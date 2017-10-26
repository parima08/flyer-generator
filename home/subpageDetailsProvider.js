
app.provider('subpageDetails', function(){
	var subpages = {}; 
	//subpages["/articles"] = { spreadsheetId: "1KcE5rNKGrTX4EVmdb-4KmZnpmJ8h92YQ8_mgpVt_FAE"}

	//subpages["/home"], subpages["/"] = {}; 
	subpages["/home"] = {}; 
	subpages["/dharmayatra"] = {
		title: "Dharmayatra Flyers (A3)",
		spreadsheetId: "1k24IRyWNX_OJtXCLVLvWzh36YtQcag20dE9v_9V6LCg", 
		width: 11, 
		height: 16,
		scale: 10
	};	
	subpages["/invitations"] = {
		title: "Invitations",
		spreadsheetId: "15bLgpQIlL-o1HaO34WOer5rHO2I7MzA_0-h8mi4togo",
		width: 6, 
		height: 4, 
		scale: 4
	};
	subpages["/banners6x10"] = {
		title: "Banners 6x10",
		spreadsheetId: "1jL69EN-uNUtvmG1rAtKFjLZ7feqblrW-j8rhbu1VhOE",
		width: 10, 
		height: 6,
		scale: 20
	};
	subpages["/banners4x6"] = {
		title: "Banners 4x6",
		spreadsheetId: "1mJoJ0Rb8FtZeEhHpt6wByFFMTFLd5KF8Nl1nEWnksZM",
		width: 6, 
		height: 4,
		scale: 20
	}

//SRD -----------------------------------------

	subpages["/srdflyers"] = {
		title: "SRD Flyers", 
		spreadsheetId: "1OR8SnYpxaAuhT1j7Cgm_hqYIxw6ry6nr5c6rtJWklNQ",
		width: 11, 
		height: 16,
		scale: 10,
	}

	subpages["/srdstandees"] = {
		title: "SRD Standees",
		spreadsheetId: "1RyIVJyR-KR4g3PFdld-oy13K-GcXCtufFye5RM0Su9I",
		width: 3, 
		height: 6,
		scale: 20
	}


//SRLC -----------------------------------------
	subpages["/srlcposters"] = {
		title: "SRLC Posters (A3)",
		spreadsheetId: "1M3QrPI2qALUzRwHMGznIxr1ZhnCpA8p8kBpfIRrVAa0",
		width: 11, 
		height: 16,
		scale: 10
	}

	subpages["/srlcbanners"] = {
		title: "SRLC Banners (4x6)",
		spreadsheetId: "1kUQJxsgSHdNY3z0-iU8JrMwA544RnbPM3R67bo4JMuc",
		width: 6, 
		height: 4,
		scale: 10
	}

	subpages["/srlcstandees"] = {
		title: "SRLC Standee",
		spreadsheetId: "1PiKOAkctDOLLXIueqfUt4dOYpilpEtuTerMDZXxj6zw",
		width: 3, 
		height: 6,
		scale: 10
	}

	//BACKDROPS ------------------

	subpages['/backdrop2by3'] = {
		title: "Backdrops 2 by 3", 
		spreadsheetId: "1ipPqO-Bul4qhH7-S3crLHwVl2Uk_Xh3SanOt5n9Etoc", 
		width: 2, 
		height: 3,
		scale: 10
	}

	subpages['/backdrop1by2'] = {
		title: "Backdrops 1 by 2", 
		spreadsheetId: "1nt9SoYA3YpxoX6y0nLfWYWdiI1sJqqKD06mNXz6VakI", 
		width: 2, 
		height: 3,
		scale: 10
	}

	subpages['/backdrop2by5'] = {
		title: "Backdrops 2x5", 
		spreadsheetId: "1rnuAR38k8wuMRwU2r6Ozz4XSVlawlnKKyxC4ZSpTLT0", 
		width: 2, 
		height: 5,
		scale: 10
	}

	subpages['/backdrop4by7'] = {
		title: "Backdrops 4x7", 
		spreadsheetId: "1d8LX8EPgf-EDgZrp1afA3fu3MmrjKvy9zhKi1ugC-2Q", 
		width: 4, 
		height: 7,
		scale: 10
	}

	this.subpages = subpages; 
	this.$get = function() {
        return subpages; 
    };

    this.setName = function(name) {
        subpages[name] = {}; 
    };
}); 