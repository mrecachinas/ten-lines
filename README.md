ten-lines
=========

One of our undergrad professors told us a statistic that was startling. Your
average programmer will only write ten lines of code a day. At first this
didn't make sense, how could some one simply write ten lines of code in a day?
What we failed to realize is the life cycle of software. In the beginning, you
might be writing large chunks of code, but that is not the end. Eventually you
get into maintenance and bug fixes, this also contributes to the average.
Furthermore, the code you write today could get refactored or changed the next
week, also contributing to the statistic.

Knowing all of this, lines of code contributed is not a suitable metric.
Contributing a net loss of code would be better! With all this said it has
provided a fun data set to visualize.


Install
-------
```bash
$ npm install -g grunt-cli
$ npm install
$ grunt
```
Now you can visit the site at **localhost:4444**.


Private Repo Support
--------------------

Currently the public app doesn't process private github repos. If you want,
simply clone the repo, (follow the install instructions), copy
`./config.defaults.js` to `config.js` and replace the username / password fields
with your github credentials.


Our Method
----------

Our method is fairly simple:

1. Prompt a user for the repo
2. Our server clones it and runs git blame which we parse to JSON and forward to
   the client.
3. The client chunks the data into buckets, lines by date, lines by file, etc.

The process was fairly straightforward. Gitblame already has all the desired
data, we simply needed to skim over the data set and visualize it as needed.

Check out `app/src/scripts/repo.js` for the bulk of the data operations. We used
[Ramda](http://ramdajs.com/) for our methods and [D3](http://d3js.org/) for our
charts. `app/server/blame.js` showcases how we search for files within the
repository and our regular expressions to convert it to JSON.

As we have worked on this, we realized there is a wealth of data we can
visualize, this is just the starting point. Check back with us after the contest
is over for more updates ;)

Thank you, its been a blast.

yolo swag swag
