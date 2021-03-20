OBJS	= main.o chunk.o util.o
SOURCE	= main.c chunk.c util.c
HEADER	= chunk.h util.h
OUT	= main
CC	 = gcc
FLAGS	 = -g -c -Wall
LFLAGS	 = -lm

all: $(OBJS)
	$(CC) -g $(OBJS) -o $(OUT) $(LFLAGS)

main.o: main.c
	$(CC) $(FLAGS) main.c 

chunk.o: chunk.c
	$(CC) $(FLAGS) chunk.c 

util.o: util.c
	$(CC) $(FLAGS) util.c 


clean:
	rm -f $(OBJS) $(OUT)
