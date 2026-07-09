type PlatformOS = 'macos' | 'windows' | 'unknown';
type PlatformArch = 'arm64' | 'x64' | 'unknown';
type PlatformStatus = 'idle' | 'detecting' | 'detected';

interface NavigatorUADataLike {
  platform?: string;
  getHighEntropyValues?: (
    hints: ('architecture' | 'bitness')[],
  ) => Promise<{
    architecture?: string;
    bitness?: string;
  }>;
}

interface NavigatorWithUAData extends Navigator {
  userAgentData?: NavigatorUADataLike;
}

let inFlightDetection: Promise<void> | null = null;

function normalizeOS(value?: string): PlatformOS {
  const normalized = value?.toLowerCase() ?? '';

  if (normalized.includes('win')) {
    return 'windows';
  }

  if (
    normalized.includes('iphone')
    || normalized.includes('ipad')
    || normalized.includes('ipod')
    || normalized.includes('ios')
    || normalized.includes('android')
  ) {
    return 'unknown';
  }

  if (normalized.includes('mac')) {
    return 'macos';
  }

  return 'unknown';
}

function normalizeArch(architecture?: string, bitness?: string): PlatformArch {
  const normalizedArch = architecture?.toLowerCase() ?? '';
  const normalizedBitness = bitness?.toLowerCase() ?? '';

  if (normalizedArch.includes('arm')) {
    return 'arm64';
  }

  if (normalizedArch.includes('x86') && normalizedBitness === '64') {
    return 'x64';
  }

  if (normalizedArch.includes('x64') || normalizedArch.includes('x86_64')) {
    return 'x64';
  }

  return 'unknown';
}

function pickOS(...values: (string | undefined)[]): PlatformOS {
  for (const value of values) {
    const os = normalizeOS(value);

    if (os !== 'unknown') {
      return os;
    }
  }

  return 'unknown';
}

function getInitialServerOS(): PlatformOS {
  if (import.meta.client) {
    return 'unknown';
  }

  const headers = useRequestHeaders(['sec-ch-ua-platform', 'user-agent']);

  return pickOS(headers['sec-ch-ua-platform'], headers['user-agent']);
}

async function readPlatform(): Promise<{ os: PlatformOS; arch: PlatformArch }> {
  if (import.meta.server) {
    return {
      os: getInitialServerOS(),
      arch: 'unknown',
    };
  }

  const navigatorWithUAData = navigator as NavigatorWithUAData;
  const uaData = navigatorWithUAData.userAgentData;
  const os = pickOS(
    uaData?.platform,
    navigator.platform,
    navigator.userAgent,
  );
  const looksLikeIPad = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  if (looksLikeIPad) {
    return {
      os: 'unknown',
      arch: 'unknown',
    };
  }

  if (os !== 'macos' || !uaData?.getHighEntropyValues) {
    return {
      os,
      arch: 'unknown',
    };
  }

  try {
    const values = await uaData.getHighEntropyValues(['architecture', 'bitness']);

    return {
      os,
      arch: normalizeArch(values.architecture, values.bitness),
    };
  } catch {
    return {
      os,
      arch: 'unknown',
    };
  }
}

export function usePlatform() {
  const os = useState<PlatformOS>('platform:os', () => getInitialServerOS());
  const arch = useState<PlatformArch>('platform:arch', () => 'unknown');
  const status = useState<PlatformStatus>('platform:status', () => 'idle');

  const isMacOS = computed(() => os.value === 'macos');
  const isWindows = computed(() => os.value === 'windows');
  const isAppleSilicon = computed(() => isMacOS.value && arch.value === 'arm64');
  const isMacIntel = computed(() => isMacOS.value && arch.value === 'x64');

  const detect = async () => {
    if (import.meta.server || status.value === 'detected') {
      return;
    }

    inFlightDetection ??= (async () => {
      status.value = 'detecting';

      const platform = await readPlatform();

      os.value = platform.os;
      arch.value = platform.arch;
      status.value = 'detected';
    })().finally(() => {
      inFlightDetection = null;
    });

    await inFlightDetection;
  };

  if (import.meta.client && status.value === 'idle') {
    void detect();
  }

  return {
    os: readonly(os),
    arch: readonly(arch),
    status: readonly(status),
    isMacOS,
    isWindows,
    isAppleSilicon,
    isMacIntel,
    detect,
  };
}
