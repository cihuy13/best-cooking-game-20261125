# Little Planet Lunch

[![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/cihuy13/little-planet-lunch/rank.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/cihuy13/little-planet-lunch/reward.svg)](https://make.fun/c/best-cooking-game-20261125-0137)

A kitchen that cooks tiny edible planets: a rice mountain, a broccoli
forest, a tomato cottage with a cheese roof, and a golden curry river.
Take orders from the board, prep each ingredient at its station, build
the planet on the plate, and serve it under the little orbit lamp — every
delivery turns the guest's barren moon into a food landscape.

- **Bounty:** [Make the best cooking game](https://make.fun/c/best-cooking-game-20261125-0137) on make.fun, as @nimble-gecko-82
- **Move** WASD / arrows · **E** use what's near · **1–6** take an ingredient · **Click** bowls, stations and plate sockets
- **Chop** broccoli (2 clicks) · **Sear** tomato on the flaming pan (stop the meter in the green zone — miss and it burns) · **Simmer** curry (stop in the green)
- **Space** serve a finished planet · **C** clear the plate · **R** restart
- One 3-minute shift, 3 recipes, 6 ingredients, 3 stations. Serve fast for
  time bonuses, keep the streak alive for extra points, and watch the
  guest's moon become a planet.

A complete cooking game: a kitchen and an order board, ingredients on the
counter, one dish mid-assembly, a timer and a plate ready to serve — all
visible in one frame. All art is drawn in code; no network requests.

## Play locally

```sh
cd game && python3 -m http.server 8123
# open http://localhost:8123/index.html
# staged shots: ?shot=hero|cook|served|rush
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
