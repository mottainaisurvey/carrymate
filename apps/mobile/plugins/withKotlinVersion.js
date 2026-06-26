/**
 * Custom Expo config plugin to set the Kotlin version in android/build.gradle.
 * This is needed because expo-build-properties sets gradle.properties but
 * expo-modules-core reads kotlinVersion from build.gradle directly.
 */
const { withProjectBuildGradle } = require('@expo/config-plugins');

const withKotlinVersion = (config, { kotlinVersion = '1.9.25' } = {}) => {
  return withProjectBuildGradle(config, (config) => {
    const contents = config.modResults.contents;
    // Replace existing kotlinVersion if present, otherwise add it
    if (contents.includes('kotlinVersion =')) {
      config.modResults.contents = contents.replace(
        /kotlinVersion\s*=\s*["'][^"']*["']/,
        `kotlinVersion = "${kotlinVersion}"`
      );
    } else if (contents.includes('ext {')) {
      config.modResults.contents = contents.replace(
        /ext\s*\{/,
        `ext {\n        kotlinVersion = "${kotlinVersion}"`
      );
    }
    return config;
  });
};

module.exports = withKotlinVersion;
