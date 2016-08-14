
    Ais=dat.sel$A
    print("Ais range is ..")
    print(range(Ais))
############ dat.top <- dat.sel[rownames(dat.sel) %in% top$Probeset, ]
{

    par(mar = c(5, 5, 5, 8))
    lim <- max(abs(range(dat.sel$M)))
    
XLAB <- "Average Expression"
YLAB <- paste0(one,
      paste(rep(" ", ifelse(inputSSlog, 15, 20)), collapse = ""),
      ifelse(inputSSlog, "Log2 Fold Change", "Fold Change"),
      paste(rep(" ", ifelse(inputSSlog, 15, 20)), collapse = ""), two)


plot(NULL, cex = 0.9,
     xaxt = "n", yaxt = "n",
     xlab = "Average Expression",
     xlim = range(dat.sel$A),
     ylim = c(-lim * 1.05, lim * 1.05), 
     ylab = paste0(one,
      paste(rep(" ", ifelse(inputSSlog, 15, 20)), collapse = ""),
      ifelse(inputSSlog, "Log2 Fold Change", "Fold Change"),
      paste(rep(" ", ifelse(inputSSlog, 15, 20)), collapse = ""), two),

     cex.lab = 1.2, 
     font.main = 1,
     cex.main = 1.2,
     main = paste(unique(gsub("1$|2$|3$", "", c(ones, twos))), collapse = " ")
)

MAINLAB <- paste(unique(gsub("1$|2$|3$", "", c(ones, twos))), collapse = " ")
    
metaList <- list(type='maplot', title=MAINLAB,  xlabel=XLAB, ylabel=YLAB)

blackX <- dat.sel$A[dat.sel$color == "black"]
blackY <- dat.sel$M[dat.sel$color == "black"]
blackSymbol <- dat.sel$symbol[dat.sel$color == "black"]
blackPtsList <- list(x=blackX, y=blackY, symbol=blackSymbol)

otherX <- dat.sel$A[dat.sel$color != "black"]
otherY <- dat.sel$M[dat.sel$color != "black"]
otherSymbol <- dat.sel$symbol[dat.sel$color != "black"]
otherColor <- dat.sel$color[dat.sel$color != "black"]
otherPtsList <- list(x=otherX, y=otherY, color=otherColor, symbol=otherSymbol)

    points(dat.sel$A[dat.sel$color == "black"],
           dat.sel$M[dat.sel$color == "black"],
           pch = 21, cex = 0.9)
    points(dat.sel$A[dat.sel$color != "black"],
           dat.sel$M[dat.sel$color != "black"],
           pch = 21, cex = 0.9,
           col = dat.sel$color[dat.sel$color != "black"])

    if (nrow(dat.top)){

topX <- dat.top$A
topY <- dat.top$M
topSymbol <-  dat.top$symbol
topPtsList <-list(x=topX, y=topY, symbol=topSymbol)

     points(dat.top$A, dat.top$M, pch = 21, 
            cex = 0.9, col = dat.top$color, bg = dat.top$color)
     text(dat.top$A, dat.top$M, dat.top$symbol, col = dat.top$color, 
      pos = ifelse(dat.top$M > 0, 3, 1), offset = 0.4, cex = 0.9)
    }

dataList <- list(blackPts=blackPtsList)

if( !is.null(otherX) && length(otherX) != 0) { 
  dataList$otherPts <- otherPtsList
}
if(!is.null(topX) && length(topX)!=0) {
  dataList$topPts <- topPtsList
}
jsonList <- list(meta=metaList, data=dataList)
write(toJSON(jsonList), "newMAplotData.json", append=FALSE)

    ats.0 <- seq(1, 9, 1)
    ats <- c(-1 * rev(ats.0), 0, ats.0)

    log.labs <- ats
    log.labs[log.labs > 0] <- paste0("+", log.labs[log.labs > 0])
print("log.labs ..")
print(log.labs)
    raw.labs <- 2 ^ ats
    raw.labs[raw.labs < 1] <- -1 / raw.labs[raw.labs < 1]
    raw.labs[raw.labs > 1] <- paste0("+", raw.labs[raw.labs > 1])
    axis(1, seq(0, 20, 1))
print("raw.labs ..")
print(raw.labs);
    if (inputSSlog) axis(2, ats, log.labs)
    else axis(2, ats, raw.labs, cex.axis = ifelse(lim > 6, 0.75, 1))
    abline(h = lfc * c(-1, 1), lty = 2)
}
