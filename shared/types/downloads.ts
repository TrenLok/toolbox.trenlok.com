export interface GithubReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface GithubRelease {
  tagName: string;
  htmlUrl: string;
  publishedAt: string;
  assets: GithubReleaseAsset[];
}

export interface DownloadItem {
  id: string;
  title: string;
  format: string;
  href: string;
}

export interface DownloadSection {
  id: 'windows' | 'macos';
  title: string;
  items: DownloadItem[];
}

export interface DownloadsResponse {
  version: string;
  releaseTag: string;
  changelogUrl: string;
  repositoryUrl: string;
  publishedAt: string;
  sections: DownloadSection[];
}
