
source("configIt.R")
source("processCEL.R")

configs <- setConfig_f()
configs$sel <-c("E11.5_Mnd_D","E12.5_Mnd_D")
processCELdata_f(configs)


