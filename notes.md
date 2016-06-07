Jade
=========
Variables
------
#{ }
!{ } 

vs

= "hello " + test.title
!= "hello " + test.title

Mixins
-------
Use a mixin: +welcome
Create mixin:
- mixin outputRating(rating)
    - for (var i = 1; .....)
        span.gly.....
Include mixin file: include _includes/mixins
