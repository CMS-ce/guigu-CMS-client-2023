
export interface Weather {
    status?:    string;
    count?:     string;
    info?:      string;
    infocode?:  string;
    forecasts?: Forecast[];
    name?:      string;
    founded?:   number;
    members?:   string[];
}

export interface Forecast {
    city:       string;
    adcode:     string;
    province:   string;
    reporttime: Date;
    casts:      Cast[];
}

export interface Cast {
    date:            Date;
    week:            string;
    dayweather:      string;
    nightweather:    string;
    daytemp:         string;
    nighttemp:       string;
    daywind:         string;
    nightwind:       string;
    daypower:        string;
    nightpower:      string;
    daytemp_float:   string;
    nighttemp_float: string;
}



