# Bloggr - a react-redux powered blogging website
***

## Deployed

surge deployed at `http://bloggr_redux_upgraded.surge.sh/`

backend deployed at `bloggrupgraded.herokuapp.com`


##  This the upgraded version of homework 5 part 2. It includes quite a bit of extra credit -- read the section below. 


## Extra Credit:

Contact me if more explanation for any of these is needed. 

- ***style*** : visible upon visiting website; extensive CSS and transitions used.
- ***input validation***: user is not allowed to enter non-valid values (i.e. empty fields for `Title`, `Tags`, `Content` fields) for already created posts.
- ***input validation***: users are not allowed to edit posts that they themselves did not create (i.e. user 'ahsan' cannot edit a post that user 'michael' created; both can, though, edit posts they themeselves created)
- ***searching by tags***
- ***autocomplete toolbar for tags***
- ***markdown content editing preview pane***
- ***fancy error handling (i.e. special component and all)***
- ***user profiles / profile pages (alongwith `/user` api endpoint etc)***
- ***image storage with s3***



# to run locally:

in different terminal windows:

  - `npm run dev` from blogger_backend dir,
  - `mongod &` from another,
  - `mongo` from another (not necessary).
