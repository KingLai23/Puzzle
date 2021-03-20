#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string.h>
#include "chunk.h"
#include "util.h"

int main(int argc, char **argv) {
    // xxd -l 256 -g 4 r.0.0.mca

	
	int xc = strtoint(argv[1], 10);
	int zc = strtoint(argv[2], 10);
		
	const char* filename = getFileName(xc, zc);
		
	Chunk* chunk = initChunk(xc, zc, filename);
		
	switch(strtoint(argv[3], 10)) {
		case 0:
			resetChunk(chunk);
			break;
		default:
			perror("good");
	}
	
	free(chunk);

	return 0;
}
