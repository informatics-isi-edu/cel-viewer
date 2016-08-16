
library(bioDist)
library(gplots)
library(limma)
library(DT)
library(oligo)

library(mouse4302.db)
library(annotate)

## read in rawData
celFiles <- list.celfiles("usc",full.names=TRUE)
myRawData <- read.celfiles(celFiles) ## myRawData_fromR
myEset <- rma(myRawData) ## myEset_fromR
#write(myEset,"myEset.R")


print(ncol(myEset))
print(nrow(myEset))

probeset <- rownames(exprs(myEset)) # probesets like 123456_at
myEset <- rbind(myEset,probeset)
#myEset$symbol <- lookUp(ps, "mouse4302.db", "SYMBOL")
#myEset$desc <- lookUp(ps, "mouse4302.db", "GENENAME")

save.csv(myEset,"myEset.R")
write.csv(exprs(myEset), file = “myExprs.csv”)
##exprs(myEset) ## readable form,
## dump into csv, 
#write.csv(myEset, file = "myEsetMatrix.csv")



