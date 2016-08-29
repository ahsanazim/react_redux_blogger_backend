import Tag from '../models/tag_model';

/*
  current limitations of tags autocomplete:
  - what to do with update? During update tags can theoretically
    be changed, deleted, even new ones created
  - this becomes harder to deal with when you consider the fact that
    each post can have multiple tags
  - possible solution involves iterating through posts, finding if there is one
    that has the corresponding tag. That is too lengthy for now, but would
    present a fix.
  Hence currently, tags never dissapear from the list.
*/

export function createTag(allTagString) {
  // string can be "jim todo" --> treat them as separate tags
  const tagsArray = allTagString.split(/(\s+)/);

  // create tag for each of element (i.e. tag) in array
  tagsArray.forEach((currVal, index, array) => {
    Tag.find({ name: currVal },
    (err, docs) => {
      if (!docs.length) {         // only if that tag doesn't already exist
        const tag = new Tag();
        tag.name = currVal;
        tag.save()
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        });
      }
    });
  });
}


export const getTags = (req, res) => {
  // shelved this method since library took care of everything anyway

  // searching by regex for anything that starts with input query
  // const regexQuery = new RegExp(`^${req.params.query}`);
  // Tag.find({ name: regexQuery }, 'name',
  //   (err, docs) => {
  //     res.json(docs);
  //   });

  Tag.find({}, 'name',          // right now returning everything
    (err, docs) => {
      res.json(docs);
    });
};
