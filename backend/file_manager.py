import os

### These functions are responsible for file managing stuff ###

def delete_extra_files(folder_path, max_file_count):
    ### This function deletes the older files when qouta limit is exceeded
    # Path to operate 
    files = os.listdir(folder_path)

    # Sort files by creation time (oldest to newest)
    sorted_files = sorted(files, key=lambda x: os.path.getctime(os.path.join(folder_path, x)))

    # qouta limit exceeded files
    num_files_to_delete = len(sorted_files) - max_file_count
    print("num_files_to_delete = ", num_files_to_delete)
    
    # removing qouta limit exceeded files
    if num_files_to_delete > 0:
        for i in range(num_files_to_delete):
            file_to_delete = os.path.join(folder_path, sorted_files[i])
            os.remove(file_to_delete)
            print(f"Deleted: {file_to_delete}")


def get_latest_file_with_suffix(folder_path, suffix,pretrained_flag):
    ### Function to get latest created file from a folder with specific suffix
    latest_file = None
    latest_creation_time = 0

    for file in os.listdir(folder_path):
        if file.endswith(suffix):
            if pretrained_flag == 0 and "usr_mdl" in file:
                continue  # Skip the file if it contains "usr_mdl" in the filename

            file_path = os.path.join(folder_path, file)
            creation_time = os.path.getctime(file_path)
            
            if creation_time > latest_creation_time:
                latest_file = file_path
                latest_creation_time = creation_time

    return latest_file


if __name__ == "__main__":
    main()
