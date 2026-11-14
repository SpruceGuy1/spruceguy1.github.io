
import { Scene, render, animate } from "/koia/renderer.js"; 
function getNeighbors(index, pgs, f = false) {
        const neighbors = [];
        if (f) {
          neighbors = [-1, -1, -1, -1];
        }
        const row = Math.floor(index / pgs);
        const col = index % pgs;

        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = col - 1; c <= col + 1; c++) {
            if (
              r >= 0 &&
              r < pgs &&
              c >= 0 &&
              c < pgs &&
              !(r === row && c === col) &&
              Math.abs(r - row) + Math.abs(c - col) <= 1
            ) {
              if (!f) {
                neighbors.push(r * pgs + c);
              } else {
                let k = r * pgs + c;
                if (k == index + pgs) {
                  neighbors[0] = k;
                } else if (k == index + 1) {
                  neighbors[1] = k;
                } else if (k == index - pgs) {
                  neighbors[2] = k;
                } else if (k == index - 1) {
                  neighbors[3] = k;
                }
              }
            }
          }
        }

        return neighbors;
      }
      function getDataNeighbors(index, p, f, data) {
        let neighbors = getNeighbors(index, p, f);
        let retval = [];
        for (let i of neighbors) {
          retval.push(data[i]);
        }
        return retval;
      }
function progress(dataArray, scene, currentPGS) {
        const original = [...dataArray];
        let iter = [];
        iter[0] = [...dataArray];
        const plantTiles = new Set("0123456789xy");

        for (let index = 0; index < original.length; index++) {
          const tile = original[index];
          if (tile !== "H" && tile !== "h") continue;

          const neighbors = getNeighbors(index, currentPGS);
          const treeTarget = [
            index + currentPGS,
            index + 1,
            index - currentPGS,
            index - 1,
          ].find(function (c) {
            return (
              neighbors.includes(c) && original[c] == "T" && iter[0][c] == "T"
            );
          });
          const target = [
            index + currentPGS, // down
            index + 1, // right
            index - currentPGS, // up
            index - 1, // left
          ].find(
            (candidate) =>
              neighbors.includes(candidate) &&
              plantTiles.has(original[candidate]) &&
              plantTiles.has(iter[0][candidate]),
          );
          if (treeTarget !== undefined) {
            iter[0][index] = "H"; // H and h become H when eating a tree, restoring health.
            iter[0][treeTarget] = "t"; // Trees lose leaves when eaten, but can grow them back.
            grow[treeTarget] = false; // Don't immediately grow leaves back
          } else if (target !== undefined) {
            iter[0][index] = "_";
            iter[0][target] = "H"; // Eating restores a low-health herbivore.
          } else if (
            data[getNeighbors(index, currentPGS)[0]] == "_" ||
            data[getNeighbors(index, currentPGS)[1]] == "_" ||
            data[getNeighbors(index, currentPGS)[2]] == "_" ||
            data[getNeighbors(index, currentPGS)[3]] == "_" ||
            data[getNeighbors(index, currentPGS)[0]] == "S" ||
            data[getNeighbors(index, currentPGS)[1]] == "S" ||
            data[getNeighbors(index, currentPGS)[2]] == "S" ||
            data[getNeighbors(index, currentPGS)[3]] == "S"
          ) {
            let newTarget = -1;
            let l = ["_", "S"]; // herbivores can go to these tiles
            let array = new Array(currentPGS ** 2).fill(2000);
            function a() {
              for (let neighbor of getNeighbors(index, currentPGS)) {
                if (l.includes(data[neighbor])) {
                  if (neighbor == index + currentPGS) {
                    array[neighbor] = 0;
                  } else if (neighbor == index + 1) {
                    array[neighbor] = 1;
                  } else if (neighbor == index - currentPGS) {
                    array[neighbor] = 2;
                  } else {
                    array[neighbor] = 3;
                  }
                }
              }
            }
          } else if (tile == "H") {
            iter[0][index] = "h";
          } else if (tile == "h") {
            iter[0][index] = "O";
            grow[index] = false; //don't immediately grow back
          }
        }
        iter[1] = [...iter[0]];
        // move babies and juveniles
        for (let index = 0; index < iter[0].length; index++) {
          const tile = iter[0][index];
          if (tile !== "B" && tile !== "J" && tile !== "j") continue;
          const neighbors = getNeighbors(index, currentPGS);
          let plantTarget = undefined;
          /*if(tile == "B"){plantTarget = [
            index + currentPGS, // down
            index + 1, // right
            index - currentPGS, // up
            index - 1, // left
          ].find(
            function(c){
              return (
                neighbors.includes(c) &&
                iter[0][c] === "S" &&
                iter[1][c] === "S"
              );
            }
          );
          }else*/ if (tile == "J" || tile == "j") {
            plantTarget = [
              index + currentPGS, // down
              index + 1, // right
              index - currentPGS, // up
              index - 1, // left
            ].find(function (c) {
              return (
                neighbors.includes(c) &&
                plantTiles.has(iter[0][c]) &&
                plantTiles.has(iter[1][c])
              );
            });
          }
          let sproutTarget = [
            index + currentPGS, // down
            index + 1, // right
            index - currentPGS, // up
            index - 1, // left
          ].find(function (c) {
            return (
              neighbors.includes(c) && iter[0][c] === "S" && iter[1][c] === "S"
            );
          });
          let treeTarget = undefined;
          if (tile == "B") {
            treeTarget = [
              index + currentPGS, // down
              index + 1, // right
              index - currentPGS, // up
              index - 1, // left
            ].find(function (c) {
              return (
                neighbors.includes(c) &&
                iter[0][c] === "T" &&
                iter[1][c] === "T"
              );
            });
          }
          if (treeTarget !== undefined) {
            iter[1][index] = "J"; // B becomes J when eating a tree, growing up.
            iter[1][treeTarget] = "t"; // Trees lose leaves when eaten, but can grow them back.
            grow[treeTarget] = false; // Don't immediately grow leaves back
          } else if (plantTarget !== undefined) {
            iter[1][plantTarget] = "H"; // j and J become H when eating a plant, restoring health and growing up.
            iter[1][index] = "_";
          } else if (sproutTarget !== undefined) {
            if (tile == "B") {
              iter[1][sproutTarget] = "J";
            } else {
              iter[1][sproutTarget] = "H";
            } // B becomes J when eating a sprout,  growing up.
            // j and J become H when eating a sprout, growing up.
            iter[1][index] = "_";
          } else if (tile == "j" || tile == "B") {
            iter[1][index] = "O"; // j and B die if they can't eat anything, becoming organic matter. J can survive without eating, but will lose health.
            grow[index] = false; // Don't immediately grow a sprout back
          } else if (tile == "J") {
            iter[1][index] = "j"; // J becomes j if it can't eat anything, losing health.
          }
        }
        iter[2] = [...iter[1]];
        for (let index = 0; index < iter[1].length; index++) {
          //sprouts become plants, OS0123456789x become S0123456789xy, y becomes t, t becomes T
          const tile = iter[1][index];
          if (!"OS0123456789xytT".includes(tile)) continue;
          if (!grow[index]) {
            grow[index] = true;
            continue;
          }
          if (tile == "y") iter[2][index] = "t";
          else if (tile == "t") iter[2][index] = "T";
          else if (tile == "O") iter[2][index] = "S";
          else if (tile == "S") iter[2][index] = "0";
          else if (tile == "T") continue;
          else {
            const num = parseInt(tile);
            if (num < 9) iter[2][index] = (num + 1).toString();
            else if (num == 9) iter[2][index] = "x";
            else if (tile == "x") iter[2][index] = "y";
            for (let neighbor of getNeighbors(index, currentPGS)) {
              if (iter[1][neighbor] == "_") {
                iter[2][neighbor] = "S"; //sprout grows in empty tile next to plant. up to 4 sprouts can grow from one plant
              }
            }
          }
        }
        loadData(iter[iter.length - 1]);
        render(document.getElementById("render"), scene.data, {
          pixelGrid: true,
          pgs: currentPGS,
        });
        return iter[iter.length - 1];
      }
      export {getNeighbors, getDataNeighbors, progress}