import time
import os
import git
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

REPO_PATH = r"C:\Users\sebastian\Desktop\Proyectos\MrFantasy\Web\Final"
PULL_SUBPATH = "Subpages/Guia/Plugins"

def get_archivos_locales():
    """Devuelve el conjunto de archivos que ya existen localmente en PULL_SUBPATH."""
    carpeta = os.path.join(REPO_PATH, PULL_SUBPATH.replace("/", os.sep))
    archivos = set()
    if os.path.exists(carpeta):
        for root, _, files in os.walk(carpeta):
            for f in files:
                ruta = os.path.relpath(os.path.join(root, f), REPO_PATH)
                archivos.add(ruta.replace(os.sep, "/"))
    return archivos

def get_archivos_remotos(repo):
    """Devuelve el conjunto de archivos en remoto dentro de PULL_SUBPATH."""
    archivos = set()
    try:
        commit_remoto = repo.remotes.origin.refs.main.commit
        for item in commit_remoto.tree.traverse():
            if item.type == "blob" and item.path.startswith(PULL_SUBPATH):
                archivos.add(item.path)
    except Exception as e:
        print(f"Error obteniendo archivos remotos: {e}")
    return archivos

def pull_solo_archivos_nuevos(repo):
    """Hace checkout solo de archivos que están en remoto pero NO en local."""
    repo.remotes.origin.fetch()
    
    locales = get_archivos_locales()
    remotos = get_archivos_remotos(repo)
    
    nuevos = remotos - locales  # solo los que no existen en local
    
    if nuevos:
        for archivo in nuevos:
            repo.git.checkout("origin/main", "--", archivo)
            print(f"↓ Archivo nuevo descargado: '{archivo}'")
    else:
        print("↓ Sin archivos nuevos para bajar")

class AutoSync(FileSystemEventHandler):
    def __init__(self):
        self.ultimo_sync = 0

    def on_modified(self, event):
        self.sync()
    def on_created(self, event):
        self.sync()
    def on_deleted(self, event):
        self.sync()

    def sync(self):
        ahora = time.time()
        if ahora - self.ultimo_sync < 3:
            return
        self.ultimo_sync = ahora
        time.sleep(1)
        try:
            repo = git.Repo(REPO_PATH)

            # Solo bajar archivos NUEVOS de la subcarpeta (no pisar modificaciones locales)
            pull_solo_archivos_nuevos(repo)

            if repo.is_dirty(untracked_files=True):
                repo.git.add(A=True)
                repo.index.commit("Auto-sync")
                repo.remotes.origin.push(refspec='main', force=True)
                print("✓ Push sincronizado")

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