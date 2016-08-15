# Bloggr - a react-redux powered blogging website
***

frontend is surge deployed at `bloggr_redux_auth.surge.sh`

### Requirements fulfilled:

The backend has all the listed requirements

### What I did:

The goal of creating this project was to gain experience using mongodb, express, and node for
creating a full-backend; it was fun, and I got to know the M and C in MVC a little more.


### What worked / what didn't work:

Most things seemed to work.


## Extra Credit:

- ***input validation***: user is not allowed to enter non-valid values (i.e. empty fields for `Title`, `Tags`, `Content` fields) for already created posts.
- ***input validation***: users are not allowed to edit posts that they themselves did not create (i.e. user 'ahsan' cannot edit a post that user 'michael' created; both can, though, edit posts they themeselves created)



to run locally:

in different terminal windows:

  - `npm run dev` from blogger_backend dir,
  - `mongod &` from another,
  - `mongo` from another (not very necessary).
