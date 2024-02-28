// file system prac

public class File {
	private String fileName;
	private int fileSize;
	private boolean isDirectory;
	private File[] files;

	/*
		Behaviors:
			getFileName
			getFileSize
			isDirectory
	*/


	/*
		If isDirectory is false then files is null.
	*/
    public File(String fileName, int fileSize, boolean isDirectory, File[] files) {
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.isDirectory = isDirectory;
        this.files = files;
    }


	public String getFileName() {
		return fileName;
	}

	public int getFileSize() {
		return fileSize;
	}

	public boolean isDirectory() {
		return isDirectory;
	}

	public File[] getFiles() {
		return files;
	}
}

// Implicitly public and abstract
interface Filter {
	boolean isMatch(File file);
}

public class fileSizeFilter implements Filter {

	public fileSizeFilter() {
		// Empty constructor
	}

	public boolean isMatch(File file) {

	}
}


public class prefixFilter implements Filter {

	public prefixFilter() {
		// Empty constructor
	}

	public boolean isMatch(File file) {

	}
}

public class suffixFilter implements Filter {

	public prefixFilter() {
		// Empty constructor
	}

	public boolean isMatch(File file) {

	}
}



public class FileFinder {

	public File rootDir;

	public FileFinder(File rootDir) {
		this.rootDir = rootDir;
	}

	/*
		Assume rootDir is a directory, what's the minimum number of files, folders in this directory and also in a directory?

		Assume at leat 1 file per directory.

		Search algorithm needed to search the graph. DFS, BFS,...

		Our filters AND and OR? let's assume AND.
	*/
	public List<String> findFile(String fileName, Filter[] filters) {

		Queue<File> queue = new LinkedList<>();

		queue.add(rootDir);

		List<String> answer = new ArrayList<>();

		while (!queue.isEmpty()) {

			File head = queue.peek();

			// search through this, if there is a file match then add it to our answer list. if there is dir, add it to the queue to search.
			// queue.add(queue.remove());

			File[] files = head.getFiles()

			for (int i = 0; i < files.length; i++) {
				File file = files[i];
				boolean match = true;

				if (file.isDirectory()) {
					queue.add(file);
				} else {
					for (int j = 0; j < filters.length; j++) { // Could change if it is AND or OR
						if (!filters[j].isMatch(file)) {
							match = false;
						}
						// add to the answer list.
						answer.add(file.getFileName());
					}
				}
			}

			queue.remove();
		}

		return answer;
	}
}

