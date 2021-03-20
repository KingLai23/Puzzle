#ifndef __CHUNK_H__
#define __CHUNK_H__

#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "util.h"

typedef struct {
	// int = base 10
	// char* = base 16

	// File
	const char* filename;
	
	// Location
	const char* locationOffset;
	int locationOffsetOffset;
	const char* locationSector;
	int locationSectorOffset;
	
	// Timestamps
	const char* timestamp;
	int timestampOffset;
	
	// Chunk
	const char* chunkLength;
	int chunkLengthOffset;
	const char* compressionType;
	int compressionTypeOffset;
	int chunkDataOffset;
	
} Chunk;

Chunk* initChunk(int x, int z, const char* f);
void resetChunk(Chunk *chunk);
const char* readChunkData(Chunk *chunk);

#endif
