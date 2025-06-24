import * as os from 'os';
import { config } from 'dotenv';
config();

if (process.env.USE_PODMAN === 'true') {
  const podmanSocketPath = `${os.homedir()}/.local/share/containers/podman/machine/podman.sock`;
  process.env.TESTCONTAINERS_SOCKET_OVERRIDE = podmanSocketPath;
  process.env.TESTCONTAINERS_DISABLE_REGISTRY_CREDENTIALS = 'true';
  process.env.TESTCONTAINERS_RYUK_DISABLED = 'true';
  console.log(`✅ Usando socket Podman en ${podmanSocketPath}`);
}