# bookmarks-server

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run start
```

### run migrations to set admin user and for creating indexes
```
npm run migrate-up
```

### removes migrations to set admin user
```
npm run migrate-down
```

### Lints and fixes files
```
npm run lint
```
### Set git user configurations as in set_git_user.sh file
```
npm run git-config
```

<!-- Sample set_git_user.sh file -->

#!/bin/bash

# Set the Git username and email for the current repository
git config user.name "{username}"
git config user.email "{email}"
ssh-add ~/{sshKeyName}



<!-- Sample set_git_user.sh file -->