import time
import git
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

REPO_PATH = r"C:\Users\sebastian\Desktop\Proyectos\MrFantasy\Web\Final"

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
            if repo.is_dirty(untracked_files=True):
                repo.git.add(A=True)
                repo.index.commit("Auto-sync")
                repo.remotes.origin.pull(rebase=True)
                repo.remotes.origin.push(refspec='main')
                print("✓ Sincronizado")
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