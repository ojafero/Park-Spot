
class ParkingMeterRepository {

    async fetchMeters(latitude, longitude, radius) {
        var data = await $.ajax({
            url: "https://data.lacity.org/resource/s49e-q6j2.json?$where=within_circle(latlng, "+latitude+","+ longitude+","+ radius+")",
            type: "GET",
            data: {
              "$limit" : 30,
              "$$app_token" : MeterKey
            }
        })

        return data;

    }

    async fetchMeterStatus(){
        var data = await $.ajax({
            url: "https://data.lacity.org/resource/e7h6-4a3e.json?occupancystate=VACANT",
            type: "GET",
            data: {
            "$limit" : 30,
            "$$app_token" : MeterStatusKey
            }
        })

        return data
    }

    async fetchVacantMeters(latitude, longitude){
        var found = false;
        var radiusLength = 1000;
        var meterStatusList = await this.fetchMeterStatus();
        var vacantMetersList = new Array();
        while(!found && radiusLength<=5000){
            var meterList = await this.fetchMeters(latitude,longitude,radiusLength);
            /** 
            console.log("FetchVacantMeters");
            console.log(meterList);
            console.log("FetechMeterStatus");
            console.log(meterStatusList); */
            radiusLength = radiusLength+1000;
            if(!meterList || meterList.length == 0) {
                console.log("couldn't find");
            }
            else {
                vacantMetersList = this.isolateVacantMeters(meterStatusList,meterList);
                if(!vacantMetersList || vacantMetersList.length == 0) continue; 
                else found = true;
            }
        }

        return vacantMetersList;

    }

    isolateVacantMeters(meterStatusList, meterList){
        var vacantMeterList = new Array();
        for (var i=0; i<meterList.length; i++){
            for (var j=0; j<meterStatusList.length; j++){
                if(meterList[i].spaceid == meterStatusList[j].spaceid){
                    vacantMeterList.push(meterList[i]);
                    break;
                }
            }
        }
        return vacantMeterList;
    }



}
