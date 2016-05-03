# adRepair
The Flashtalking Adfile Repair tool performs a series of checks and corrections on your adfile to ensure
            that it is compatible with the Flashtalking system.<br><br>These checks include:<br>
            - Making sure a manifest file exists<br>
            - Detecting if there is a filename mismatch within the manifest<br>
            - Replacing any nonsecure Edge Animate calls<br>
            - Removing any unnecessary subfolders<br>
            - Finding and removing special characters in file name<br><br>
            If no manifest file is detected, the adfile repair tool will create one for you. It will first attempt to
            extract the dimensions from the filename. If no dimensions are found in the filename, the tool will prompt
            you to manually input the dimensions for that adfile.<br><br>
            All updated files will save out to your specified download folder