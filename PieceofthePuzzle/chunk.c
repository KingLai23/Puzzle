#include "chunk.h"  

Chunk* initChunk(int x, int z, const char* f) {

	Chunk* chunk = calloc(sizeof(Chunk), 1);
	
	if (chunk == NULL) {
		printf("null");
		return NULL;
	}
	
	chunk -> filename = f;
	
	while (x < 0) x += 32;
    while (z < 0) z += 32;
    
	chunk -> locationOffsetOffset = 4 * ((x % 32) + (z % 32) * 32);
	chunk -> locationOffset = readBytes(f, chunk -> locationOffsetOffset, 3);
	
	chunk -> locationSectorOffset = chunk -> locationOffsetOffset + 3;
	chunk -> locationSector = readBytes(f, chunk -> locationSectorOffset, 1);
	
	chunk -> timestampOffset = chunk -> locationOffsetOffset + 4096;
	chunk -> timestamp = readBytes(f, chunk -> timestampOffset, 4);
	
	chunk -> chunkLengthOffset = strtoint(chunk -> locationOffset, 16) * 4096;
	chunk -> chunkLength = readBytes(f, chunk -> chunkLengthOffset, 4);
	
	chunk -> compressionTypeOffset = chunk -> chunkLengthOffset + 4;
	chunk -> compressionType = readBytes(f, chunk -> compressionTypeOffset, 1);
	
	chunk -> chunkDataOffset = chunk -> chunkLengthOffset + 5;
	
	return chunk;
}

void resetChunk(Chunk *chunk) {
	int cpb = 2;

	writeBytes(chunk -> filename, chunk -> locationOffsetOffset, generateZeros(3*cpb));
	writeBytes(chunk -> filename, chunk -> locationSectorOffset, generateZeros(1*cpb));
	writeBytes(chunk -> filename, chunk -> timestampOffset, generateZeros(4*cpb));
	writeBytes(chunk -> filename, chunk -> chunkLengthOffset, generateZeros(4*cpb));
	writeBytes(chunk -> filename, chunk -> compressionTypeOffset, generateZeros(1*cpb));
	
	int temp = chunk -> compressionTypeOffset + 1;
	int end = temp + strtoint(chunk -> chunkLength, 16);
	
	while (temp < end) {
    	if (end - temp >= 16) {
    		writeBytes(chunk -> filename, temp, generateZeros(16 * cpb));
    		temp += 16;
    	} else {
    		writeBytes(chunk -> filename, temp, generateZeros((end - temp) * cpb));
    		temp += end - temp;
    	}
    }
}

const char* readChunkData(Chunk *chunk) {
	return NULL;
}