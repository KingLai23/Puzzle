#include "util.h"

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
	
	int quotient;
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

  	while (begin < end) {
    	temp = hex[begin];
    	hex[begin] = hex[end];
    	hex[end] = temp;
    	begin++;
    	end--;
  	}
  	
  	hex[i] = '\0';
	return hex;
}

int strtoint(const char* s, int base) {
	char *ptr;
	return (int)strtol(s, &ptr, base);
}

char* inttostr(int i) {
	int len = 1;
	if (i > 9) len = floor(log10(abs(i))) + 1;
	
	char* asStr = calloc(sizeof(char), len+1);
	sprintf(asStr, "%d", i);
	
	return asStr;
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

    char *filename = calloc(sizeof(char), 1024);
    strcat(filename, "/home/zi-server/minecraft/world/region/");
    
    strcat(filename, "r.");
    strcat(filename, bufferx);
    strcat(filename, bufferz);
    strcat(filename, "mca");
    
    return filename;
}

const char* readBytes(const char* filename, int offset, int numBytes) {
	FILE *fp;
  	char *tempBuffer = calloc(sizeof(char), 2*numBytes+1);

	char* bufferOffset = inttostr(offset);
	char* bufferNumBytes = inttostr(numBytes);
	
	char* command = calloc(sizeof(char), 1024);
	strcat(command, "sudo xxd -s ");
	strcat(command, bufferOffset);
	strcat(command, " -p -l ");
	strcat(command, bufferNumBytes);
	strcat(command, " ");
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

void writeBytes(const char* filename, int offset, char* bytes) {
	if (strlen(bytes) > 16 * 2 || strlen(bytes) % 2 != 0 || strlen(bytes) == 0) {
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



















