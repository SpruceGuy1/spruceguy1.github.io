hi=[]
for i in range(3):
    name=input ('wuts yo name?')
    hi.append(name.capitalize()+', ')
name=input ('wuts yo name?')
hi.append('and, '+name.capitalize())
print()
print('Your names are ')
print(hi)
question1answer=input(hi[1]+"enter a number fro 1 to 10 and don't tell anyone")
question1=input(hi[0]+"guess a number from 1 to 10.")
print(question1answer)
if question1answer==question1:
    print('correctamundo!')
else:
    print('you lose')