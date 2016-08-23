
source("configIt.R")
source("processCEL.R")

configs <- setConfig_f()
configs$sel <-c("E14.5_Max_D","E14.5_Max_P")
processCELdata_f(configs)


