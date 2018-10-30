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
		title: "Invitations 6x4",
		spreadsheetId: "15bLgpQIlL-o1HaO34WOer5rHO2I7MzA_0-h8mi4togo",
		width: 6, 
		height: 4, 
		scale: 4
	};

	subpages["/invitations6x6"] = {
		title: "Invitations 6x6",
		spreadsheetId: "1yHqqdRRDVDts2oQH8sptDt-9fi60BrTpjULaeNTq_ZM",
		width: 13.5, 
		height: 6.45, 
		scale: 4
	};

	subpages["/banners6x10"] = {
		title: "Banners 6x10",
		spreadsheetId: "1jL69EN-uNUtvmG1rAtKFjLZ7feqblrW-j8rhbu1VhOE",
		width: 10, 
		height: 6,
		scale: 10
	};
	subpages["/banners4x6"] = {
		title: "Banners 4x6",
		spreadsheetId: "1mJoJ0Rb8FtZeEhHpt6wByFFMTFLd5KF8Nl1nEWnksZM",
		width: 6, 
		height: 4,
		scale: 10
	};
	subpages["/sessionbanners6x10"] = {
		title: "Session Banners 6x10",
		spreadsheetId: "1zkW2jIut_oU6EMr5L_5vOBP1UVlWbBEE-ziSWSqy6RY",
		width: 10, 
		height: 6,
		scale: 10
	};
	subpages["/swadhyaykarflyer"] = {
		title: "Swadhyaykar Flyer",
		spreadsheetId: "18w1P8DEBvgTLbCsqSu3JXfqSF2PMlhWuP4-NhXJFvi0",
		width: 11.7, 
		height: 16.5,
		scale: 10
	}
	// subpages["/swadhyaykarbanner"] = {
	// 	title: "Swadhyaykar Banner",
	// 	spreadsheetId: "1a9ad1DKUgB4Gbdkdw-YLzIXs53-jz0vL4Psgt4q5O4M",
	// 	width: 6, 
	// 	height: 10,
	// 	scale: 10
	// }
	subpages["/sessionflyers"] = {
		title: "Session Flyers",
		spreadsheetId: "1YWCuxVHwYFdwqRcOq53909-fex9XGqqyRGCuhMEuDF4", 
		width: 11, 
		height: 16,
		scale: 10, 
	}
	subpages["/letterheads"] = {
		title: "Letterheads",
		spreadsheetId: "1geyvSxiOsW5IUNSoIQsjk5Zx_66TaTF0zGDuAm9rGJw",
		width: 8, 
		height: 11, 
		scale: 3
	};
	subpages["/envelopes"] = {
		title: "Envelopes",
		spreadsheetId: "1Y5DnwhsWwtqdgUf19sWlx_b9UgGnAMBXT-y4N2qHm8U",
		width: 8, 
		height: 4, 
		scale: 4
	};
	subpages["/cards"] = {
		title: "Cards",
		spreadsheetId: "1eih_6DPMG2zFopaHrnoC4hiCmYMeDL2ZG4uiOCR8kqg",
		width: 4, 
		height: 6, 
		scale: 4
	};
	

	subpages['/sadguruwhispers'] = {
		title: "Sadguru Whisper Flyers",
		spreadsheetId: "1cK1Q4wXbakN7M76DMRD-NLmXeMfgSnBEhj2egC35XvA",
		width: 9, 
		height: 9, 
		scale: 2
	}

	//subpages["/sessionflyers"] = {}; 

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
		scale: 10
	}

	subpages["/postcard-flyers"] = {
		title: "Post Card Flyers",
		spreadsheetId: ""
	}; 


//SRLC -----------------------------------------
	subpages["/srlcposters"] = {
		title: "SRLC Posters (A3)",
		spreadsheetId: "1M3QrPI2qALUzRwHMGznIxr1ZhnCpA8p8kBpfIRrVAa0",
		width: 11, 
		height: 16,
		scale: 10
	}

	subpages["/srlcbanners3x6"] = {
		title: "SRLC Blood Donation Banners (3x6)",
		spreadsheetId: "1kUQJxsgSHdNY3z0-iU8JrMwA544RnbPM3R67bo4JMuc",
		width: 6, 
		height: 3,
		scale: 10
	}

	subpages["/srlcbanners4x6"] = {
		title: "SRLC Other Banners (4x6)",
		spreadsheetId: "1Se37l2vabhnvRrRwL_lNtOnG8gcdwvmgpKL-NXUBoWc",
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

	subpages["/srlcwhatsapp"] = {
		title: "SRLC Whatsapp Images",
		spreadsheetId: "1RXtbGlr_eRjQoKIu7MEhLk-IIwtl-w0Z-AgMKq4aZmk",
		width: 4, 
		height: 10,
		scale: 10
	}

	//BACKDROPS ------------------

	subpages['/backdrop2by3'] = {
		title: "Backdrops 2 by 3", 
		spreadsheetId: "1ipPqO-Bul4qhH7-S3crLHwVl2Uk_Xh3SanOt5n9Etoc", 
		width: 3, 
		height: 2,
		scale: 10
	}

	subpages['/backdrop1by2'] = {
		title: "Backdrops 1 by 2", 
		spreadsheetId: "1nt9SoYA3YpxoX6y0nLfWYWdiI1sJqqKD06mNXz6VakI", 
		width: 2, 
		height: 1,
		scale: 10
	}

	subpages['/backdrop2by5'] = {
		title: "Backdrops 2x5", 
		spreadsheetId: "1rnuAR38k8wuMRwU2r6Ozz4XSVlawlnKKyxC4ZSpTLT0", 
		width: 5, 
		height: 2,
		scale: 10
	}

	subpages['/backdrop4by7'] = {
		title: "Backdrops 4x7", 
		spreadsheetId: "1d8LX8EPgf-EDgZrp1afA3fu3MmrjKvy9zhKi1ugC-2Q", 
		width: 7, 
		height: 4,
		scale: 10
	}

	subpages['/generalStandees'] = {
		title: "General Standees", 
		spreadsheetId: "1APh1llzpmIdt3S2blzd-NRu-8qPE5Vdt9fzjtwtDwLw", 
		width: 3, 
		height: 6, 
		scale: 10
	}

	subpages['/dharmayatraStandees'] = {
		title: "Dharmayatra Standees", 
		spreadsheetId: "1jn8MDRV4qWMx5MYnQe1O9X7-JEf20AD2HkHD5Ajl9x8", 
		width: 3, 
		height: 6, 
		scale: 10
	}

	subpages['/momentos'] = {
		title: "Momementos", 
		spreadsheetId: "1dOEHwcc5L36XBRmgQk8uGxa8bl8nhBHiax3M07ouBys", 
		width: 11.7, 
		height: 16.5, 
		scale: 4
	}


	this.subpages = subpages; 
	this.$get = function() {
        return subpages; 
    };

    this.setName = function(name) {
        subpages[name] = {}; 
    };
}); 