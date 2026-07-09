import type { GithubRelease } from '~~/shared/types/downloads';

const externalDownloadsCacheMaxAge = 60 * 10;
const externalDownloadsTimeout = 5000;
const githubRepository = {
  owner: 'TrenLok',
  name: 'vscode-toolbox',
} as const;

interface GithubReleaseApiResponse {
  tag_name: string;
  html_url: string;
  published_at: string;
  assets: {
    name: string;
    browser_download_url: string;
  }[];
}

const cachedLatestGithubRelease = cachedFunction(async (
  githubRepoOwner: string,
  githubRepoName: string,
): Promise<GithubRelease> => {
  const apiUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/releases/latest`;
  const release = await $fetch<GithubReleaseApiResponse>(apiUrl, {
    headers: getGithubHeaders(),
    timeout: externalDownloadsTimeout,
  });

  assertGithubReleaseResponse(release);

  return {
    tagName: release.tag_name,
    htmlUrl: release.html_url,
    publishedAt: release.published_at,
    assets: release.assets.map((asset) => ({
      name: asset.name,
      browser_download_url: asset.browser_download_url,
    })),
  };
}, {
  name: 'github-latest-release',
  getKey: (githubRepoOwner: string, githubRepoName: string) => `${githubRepoOwner}/${githubRepoName}`,
  maxAge: externalDownloadsCacheMaxAge,
  swr: false,
});

export const githubRepositoryUrl = `https://github.com/${githubRepository.owner}/${githubRepository.name}`;

export async function fetchLatestGithubRelease(): Promise<GithubRelease> {
  const release = await cachedLatestGithubRelease(githubRepository.owner, githubRepository.name);

  if (!release) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to resolve the latest GitHub release.',
    });
  }

  return release;
}

function getGithubHeaders(): Record<string, string> {
  return {
    accept: 'application/vnd.github+json',
    'user-agent': 'vscode-toolbox-site',
  };
}

function assertGithubReleaseResponse(release: GithubReleaseApiResponse): asserts release is GithubReleaseApiResponse {
  if (!release.tag_name || !release.html_url || !release.published_at || !Array.isArray(release.assets)) {
    throw createError({
      statusCode: 502,
      statusMessage: 'GitHub returned an invalid latest release response.',
    });
  }
}
