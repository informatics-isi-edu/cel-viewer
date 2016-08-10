
library(bioDist)
library(gplots)
library(limma)
library(DT)
library(oligo)


## read in rawData
celFiles <- list.celfiles("usc",full.names=TRUE)
myRawData <- read.celfiles(celFiles) ## myRawData_fromR
myEset <- rma(myRawData) ## myEset_fromR
#write(myEset,"myEset.R")
save.csv(myEset,"myEset.R")
write.csv(exprs(myEset), file = “myExprs.csv”)
##exprs(myEset) ## readable form,
## dump into csv, 
#write.csv(myEset, file = "myEsetMatrix.csv")



