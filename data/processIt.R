
source("configIt.R")
source("processCEL.R")

configs <- setConfig_f()
configs$sel <-c("E10.5_Mnd_D","E10.5_Mnd_P")
#configs$comp <-"age"
processCELdata_f(configs)


