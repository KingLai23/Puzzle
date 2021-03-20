#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string.h>
#define CHARS_PER_BYTE 2  

char* generateZeros(int digits) {
	char* zeros = calloc(sizeof(char), digits + 1);
	for (int i = 0; i < digits; i++) {
		strcat(zeros, "0");
	}
	
	return zeros;
}

char* toHex(int base10) {
	if (base10 == 0) {
		return "0";
	}
	
	long int remainder,quotient;
	int i=1,temp;
	char *hex = calloc(sizeof(char), 9);
	quotient = base10;
	while(quotient!=0) {
		temp = quotient % 16;
		if( temp < 10) {
			temp =temp + 48; 
		} else {
			temp = temp + 55;
		}
		hex[i++]= temp;
		quotient = quotient / 16;
	}
	
	int begin = 0;
	int end = i-1;

  	while (begin < end)
  	{
    	temp = hex[begin];
    	hex[begin] = hex[end];
    	hex[end] = temp;
    	begin++;
    	end--;
  	}
  	
  	hex[i] = '\0';
	return hex;
}

const char* getFileName(int xc, int zc) {
	int regionX = (int) (floor(xc / 32.0));
    int regionZ = (int) (floor(zc / 32.0));

    int nx = 1;
    if (regionX != 0) nx = floor(log10(abs(regionX))) + 1; 

    int nz = 1;
    if (regionZ != 0) nz = floor(log10(abs(regionZ))) + 1; 

    char *bufferx = calloc(sizeof(char), nx+2);
    sprintf(bufferx, "%d.", regionX);
    char *bufferz = calloc(sizeof(char), nz+2);
    sprintf(bufferz, "%d.", regionZ);

    char *filename = calloc(sizeof(char), 7+nx+nz);
    
    strcat(filename, "r.");
    strcat(filename, bufferx);
    strcat(filename, bufferz);
    strcat(filename, "mca");
    
    return filename;
}

const char* readBytes(const char* filename, int offset, int numBytes) {
	FILE *fp;
  	char *tempBuffer = calloc(sizeof(char), 2*numBytes+1);

	int nOffset = 1;
	if (offset > 9) nOffset = floor(log10(abs(offset))) + 1;
	int nNumBytes = 1;
	if (numBytes > 9) nNumBytes = floor(log10(abs(numBytes))) + 1;
	 
	char* bufferOffset = calloc(sizeof(char), nOffset+2);
	char* bufferNumBytes = calloc(sizeof(char), nNumBytes+2);
	sprintf(bufferOffset, "%d ", offset);
	sprintf(bufferNumBytes, "%d ", numBytes);
	
	char* command = calloc(sizeof(char), 1024);
	strcat(command, "sudo xxd -s ");
	strcat(command, bufferOffset);
	strcat(command, "-p -l ");
	strcat(command, bufferNumBytes);
	strcat(command, filename);
	
  	fp = popen(command, "r");
  	if (fp == NULL) {
    	perror("Failed to run command\n" );
    	exit(1);
  	}

   	fread(tempBuffer, 2*numBytes+1, 1, fp);
  	pclose(fp);

  	return tempBuffer;
}

// bytes is really characters, so 32 characters can be written at a time
void writeBytes(const char* filename, int offset, char* bytes) {
	if (strlen(bytes) > 16 * CHARS_PER_BYTE || strlen(bytes) % 2 != 0 || strlen(bytes) == 0) {
		perror("bad");
		exit(2);
	}
	
	char* offsetHexStr = toHex(offset);
	
	FILE *fp;
  	//char *tempBuffer = calloc(sizeof(char), 2*numBytes+1);
	
	char* command = calloc(sizeof(char), 1024);
	strcat(command, "sudo echo '");
	strcat(command, offsetHexStr);
	strcat(command, ": ");
	strcat(command, bytes);
	strcat(command, "' | xxd -r - ");
	strcat(command, filename);
	printf("command: %s\n", command);
	
  	fp = popen(command, "r");
  	if (fp == NULL) {
    	perror("Failed to run command\n" );
    	exit(1);
  	}

   	//fread(tempBuffer, 2*numBytes+1, 1, fp);
  	pclose(fp);

  	//return tempBuffer;
}

void resetChunk(int xc, int zc) {
    char *filename = calloc(sizeof(char), 1024);
    strcat(filename, "/home/zi-server/minecraft/world/region/"); // TEMP
    strcat(filename, getFileName(xc, zc));
    
    while (xc < 0) {
    	xc += 32;
    }
    while (zc < 0) {
    	zc += 32;
    }
    
    int locationData = 4 * ((xc % 32) + (zc % 32) * 32);
    printf("locationData: %d\n", locationData);
    const char *locationDataOffsetSectors = readBytes(filename, locationData, 3);
    printf("locationDataOffsetSectors: %s", locationDataOffsetSectors);
    int locationDataOffsetInt = strtol(locationDataOffsetSectors, NULL, 16) * 4096; // stored in 4096B sectors
    int nlocationDataOffsetInt = 1;
	if (locationDataOffsetInt > 9) nlocationDataOffsetInt = floor(log10(abs(locationDataOffsetInt))) + 1;
    char* locationDataOffset = calloc(sizeof(char), nlocationDataOffsetInt+1);
    sprintf(locationDataOffset, "%d ", locationDataOffsetInt);
    printf("locationDataOffset: %s\n", locationDataOffset);
    
    const char *locationDataSectors = readBytes(filename, locationData + 3, 1); // unused
    
    // erasing time data
	int timeData = locationData + 4096;
	writeBytes(filename, timeData, generateZeros(4 * CHARS_PER_BYTE));
    
    const char *chunkSize = readBytes(filename, (int) strtol(locationDataOffset, NULL, 10), 4);
    int chunkDataOffsetStart = ((int) strtol(locationDataOffset, NULL, 16)) + 4;
    int chunkDataOffsetEnd = chunkDataOffsetStart + (int) strtol(chunkSize, NULL, 16); // non inclusive
    printf("bytes to erase: %d\n", chunkDataOffsetEnd - chunkDataOffsetStart);
    // erasing chunk data
    int temp = chunkDataOffsetStart;
    while (temp < chunkDataOffsetEnd) {
    	if (chunkDataOffsetEnd - temp >= 16) {
    		writeBytes(filename, temp, generateZeros(16 * CHARS_PER_BYTE));
    		temp += 16;
    	} else {
    		writeBytes(filename, temp, generateZeros((chunkDataOffsetEnd - temp) * CHARS_PER_BYTE));
    		temp += chunkDataOffsetEnd - temp;
    	}
    }
    
    // erasing chunk offset data
    writeBytes(filename, (int) strtol(locationDataOffset, NULL, 16), generateZeros(4 * CHARS_PER_BYTE));
    
    // erasing location data
    writeBytes(filename, locationData, generateZeros(4 * CHARS_PER_BYTE));
}

int main (char *argc, char **argv) {
    // xxd -l 256 -g 4 r.0.0.mca
    
    char *ptr;
	
	int xc = (int)strtol(argv[1], &ptr, 10);
	int zc = (int)strtol(argv[2], &ptr, 10);
		
	resetChunk(xc, zc);
    //resetChunk((int)strtol(argv[1], &ptr, 10), (int)strtol(argv[2], &ptr, 10));
}
