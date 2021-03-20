#ifndef __UTIL_H__
#define __UTIL_H__

#include <stdlib.h>
#include <math.h>
#include <string.h>
#include <stdio.h>

char* generateZeros(int n);
char* toHex(int base10);
int strtoint(const char *s, int base);
char* inttostr(int i);
const char* getFileName(int xc, int zc);
const char* readBytes(const char* filename, int offset, int numBytes);
void writeBytes(const char* filename, int offset, char* toWrite);

#endif
