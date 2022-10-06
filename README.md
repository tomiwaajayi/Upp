### How To Use

Description: This lib contains all pay-v3 microservices shared files.

[Note]: Don't make change to the /src files.

After making change to the .ts file:

- Run `yarn tsc` to compile the files
- Run `git add .` && `git commit -m 'somethings'` && `git push origin master`

Now:

- Go to your desired microservice and ensure this is in the `package.json` file of that `"shared": "git+https://winninggreat@bitbucket.org/verifing/shared.git",` microservice, if not add it.

- RUN `yarn upgrade shared` - in the terminal context of the microservice you are working with.
