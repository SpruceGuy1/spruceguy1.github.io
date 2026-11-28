# import
import random
#ask for names and player count
names = []
playerCount = min(6,int(input("How many players? (max 6)")))
for i in range(playerCount):
    names.append(input("What's your name?"))
# initialize arrays
done = []
not_done = list(range(playerCount))
values = [0] * playerCount
# hit or stay function
def ghos():
    p = input("Hit or stay?")

    if p.lower() in ["hit", "h", "hit me", "hitme", "hit_me"]:
        return True
    elif p.lower() in ["stay", "s", "don't hit", "keep"]:
        return False
    else:
        print("You must respond 'hit' 'h' 'hit me' 'hitme' 'hit_me' 'stay' 's' \"don't hit\" or 'keep' ")
        return ghos()
# loop function
def play(not_don):
    for i in not_don:
        if ghos():
            values[i] += random.choice([11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10])
            print("You now have" + str(values[i]))
        else:
            not_don = [x for x in not_don if x != i]
            done.append(i)
    if len(not_don) == 0:
        closest = min(values, key=lambda x: abs(x - 21))
        winner = values.index(closest)
        print("The winner is "+names[winner])
    else:
        play(not_don)
play(not_done)



    
