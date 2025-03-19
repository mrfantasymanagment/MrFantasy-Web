import time
import shutil
import tempfile
import os
import git
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

REPO_PATH = r"C:\Users\sebastian\Desktop\Proyectos\MrFantasy\Web\Final"
PLUGINS_REL = r"Subpages\Guia\Plugins"
PLUGINS_LOCAL = os.path.join(REPO_PATH, PLUGINS_REL)

class AutoSync(FileSystemEventHandler):
    def __init__(self):
        self.ultimo_sync = 0

    def on_modified(self, event): self.sync()
    def on_created(self, event):  self.sync()
    def on_deleted(self, event):  self.sync()

    def sync(self):
        ahora = time.time()
        if ahora - self.ultimo_sync < 3:
            return
        self.ultimo_sync = ahora
        time.sleep(1)

        try:
            repo = git.Repo(REPO_PATH)

            # 1. Guardar temporalmente el contenido actual de Plugins (local)
            tmp_dir = tempfile.mkdtemp()
            tmp_plugins = os.path.join(tmp_dir, "Plugins")
            if os.path.exists(PLUGINS_LOCAL):
                shutil.copytree(PLUGINS_LOCAL, tmp_plugins)
                print("📦 Backup temporal de Plugins guardado")

            # 2. Traer la versión remota de esa carpeta (fetch sin merge)
            repo.remotes.origin.fetch()
            try:
                # Restaurar solo esa carpeta desde el remoto
                repo.git.checkout("origin/main", "--", PLUGINS_REL.replace("\\", "/"))
                print("⬇️  Plugins restaurado desde remoto")
            except git.GitCommandError:
                print("⚠️  No se encontró la carpeta en el remoto, se usará la local")

            # 3. Si había contenido local, sobreescribir encima del remoto
            #    (local tiene prioridad sobre remoto para esta carpeta)
            if os.path.exists(tmp_plugins):
                if os.path.exists(PLUGINS_LOCAL):
                    shutil.rmtree(PLUGINS_LOCAL)
                shutil.copytree(tmp_plugins, PLUGINS_LOCAL)
                print("🔀 Contenido local de Plugins aplicado sobre el remoto")

            # Limpiar temp
            shutil.rmtree(tmp_dir)

            # 4. Hacer commit y push forzado con todo
            if repo.is_dirty(untracked_files=True):
                repo.git.add(A=True)
                repo.index.commit("Auto-sync")
                repo.remotes.origin.push(refspec='main', force=True)
                print("✓ Sincronizado")
            else:
                print("✓ Sin cambios que commitear")

        except Exception as e:
            print(f"Error: {e}")

observer = Observer()
observer.schedule(AutoSync(), REPO_PATH, recursive=True)
observer.start()
print("👀 Watching... (Ctrl+C para detener)")
try:
    while True:
        time.sleep(2)
except KeyboardInterrupt:
    observer.stop()
observer.join()