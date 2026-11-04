import { Config } from '@remotion/cli/config';
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(17);
Config.setPixelFormat('yuv420p');
Config.setAudioCodec('aac');
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer('swangle');
Config.setBrowserExecutable(process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome');
Config.overrideWebpackConfig((c) => enableTailwind(c));
