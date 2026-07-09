import type {
  DownloadItem,
  DownloadsResponse,
  DownloadSection,
  GithubReleaseAsset,
} from '~~/shared/types/downloads';
import { fetchLatestGithubRelease, githubRepositoryUrl } from './github-release';

type SectionId = DownloadSection['id'];
type Architecture = 'arm64' | 'x64' | 'unknown';

const sectionTitles: Record<SectionId, string> = {
  windows: 'Windows',
  macos: 'macOS',
};

const sectionOrder: Record<SectionId, number> = {
  windows: 0,
  macos: 1,
};

const architectureOrder: Record<Architecture, number> = {
  arm64: 0,
  x64: 1,
  unknown: 2,
};

interface ClassifiedAsset extends DownloadItem {
  sectionId: SectionId;
  architecture: Architecture;
  sourceName: string;
}

export async function getDownloadsResponse(): Promise<DownloadsResponse> {
  const release = await fetchLatestGithubRelease();
  const sections = buildDownloadSections(release.assets);

  return {
    version: release.tagName,
    releaseTag: release.tagName,
    changelogUrl: release.htmlUrl,
    repositoryUrl: githubRepositoryUrl,
    publishedAt: release.publishedAt,
    sections,
  };
}

function buildDownloadSections(assets: GithubReleaseAsset[]): DownloadSection[] {
  const sections = new Map<SectionId, {
    id: SectionId;
    title: string;
    items: ClassifiedAsset[];
  }>();

  for (const asset of assets) {
    const classifiedAsset = classifyAsset(asset);

    if (!classifiedAsset) {
      continue;
    }

    if (!sections.has(classifiedAsset.sectionId)) {
      sections.set(classifiedAsset.sectionId, {
        id: classifiedAsset.sectionId,
        title: sectionTitles[classifiedAsset.sectionId],
        items: [],
      });
    }

    const section = sections.get(classifiedAsset.sectionId);

    section?.items.push({
      ...classifiedAsset,
    });
  }

  return [...sections.values()]
    .toSorted((left, right) => sectionOrder[left.id] - sectionOrder[right.id])
    .map((section) => ({
      id: section.id,
      title: section.title,
      items: section.items
        .toSorted(compareDownloadItems)
        .map(({ architecture, sectionId, sourceName, ...item }) => item),
    }));
}

function classifyAsset(asset: GithubReleaseAsset): ClassifiedAsset | null {
  if (shouldIgnoreAsset(asset.name)) {
    return null;
  }

  const format = getAssetFormat(asset.name);

  if (!format) {
    return null;
  }

  const sectionId = getSectionId(format);

  if (!sectionId) {
    return null;
  }

  const architecture = getArchitecture(asset.name);

  return {
    id: slugify(asset.name),
    sectionId,
    architecture,
    title: getDownloadTitle(sectionId, architecture),
    format,
    href: asset.browser_download_url,
    sourceName: asset.name,
  };
}

function shouldIgnoreAsset(name: string): boolean {
  const normalizedName = name.toLowerCase();

  return normalizedName === 'latest.json'
    || normalizedName.endsWith('.sig')
    || normalizedName.endsWith('.sha256')
    || normalizedName.endsWith('.sha512')
    || normalizedName.endsWith('.blockmap');
}

function getAssetFormat(name: string): string | null {
  const normalizedName = name.toLowerCase();

  if (normalizedName.endsWith('.exe')) {
    return '.exe';
  }

  if (normalizedName.endsWith('.dmg')) {
    return '.dmg';
  }

  return null;
}

function getSectionId(format: string): SectionId | null {
  if (format === '.exe') {
    return 'windows';
  }

  if (format === '.dmg') {
    return 'macos';
  }

  return null;
}

function getArchitecture(name: string): Architecture {
  const normalizedName = name.toLowerCase();

  if (/(arm64|aarch64|apple-silicon)/.test(normalizedName)) {
    return 'arm64';
  }

  if (/(x64|amd64|intel)/.test(normalizedName)) {
    return 'x64';
  }

  return 'unknown';
}

function getDownloadTitle(
  sectionId: SectionId,
  architecture: Architecture,
): string {
  if (sectionId === 'windows') {
    if (architecture === 'arm64') {
      return 'Windows ARM64';
    }

    if (architecture === 'x64' || architecture === 'unknown') {
      return 'Windows 10, 11';
    }
  }

  if (sectionId === 'macos') {
    if (architecture === 'arm64') {
      return 'Apple Silicon (arm64)';
    }

    if (architecture === 'x64') {
      return 'Intel (x64)';
    }

    return 'macOS';
  }

  return sectionTitles[sectionId];
}

function compareDownloadItems(left: ClassifiedAsset, right: ClassifiedAsset): number {
  return architectureOrder[left.architecture] - architectureOrder[right.architecture]
    || left.sourceName.localeCompare(right.sourceName);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
}
