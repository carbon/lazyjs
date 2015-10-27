# lazyjs

A JavaScript library to lazy load img elements as they come into view.

Example:

```
<img class="lazy" data-src="/images/big.gif" />

<script>
var lazy = new Carbon.LazyLoader();

lazy.setup();
</script>
```