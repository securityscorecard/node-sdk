export default function mockEnv(override: any) {
  const envSnapshoot = { ...process.env };
  process.env = { ...envSnapshoot, ...override };
  // eslint-disable-next-line no-return-assign
  return () => (process.env = { ...envSnapshoot });
}
