# Advent of Code 2019

My solutions for https://adventofcode.com/2019

Some of us at work (https://www.thomasnet.com/) compete in a private leaderboard.

Each numbered directory contains that day's code. Within each dir, 1.js is part one and 2.js is part two. For example, to run part 1 of day 2:

Initial setup of common files:
```
cd common
npm install
```

Run day 2, part 1:
```
(Assuming the input is copied to your clipboard)
cd 2
npm install
pbpaste | ./1.js
```

To see the `logger.debug` output, set LOG_LEVEL env var to debug. For example:
```
pbpaste | LOG_LEVEL=debug ./1.js
```

# My goals this year:

1. Learning exercise. Try out some new functions/idioms/etc when possible.
1. Win the trophy!

I started dumping some notes & thoughts into [journal.md](journal.md). I'm not sure I'll keep up with that.

![Thomas trophy for Advent of Code 2019](/advent_of_code_2019_trophy.png)
