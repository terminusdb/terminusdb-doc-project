const getJobs = (data) => {
  return data.filter((ele) => ele.includes("JobInterest", 0));
};

const getChannels = (data) => {
  return data.filter((ele) => ele.includes("YouTube", 0));
};

const getResources = (data) => {
  return data.filter((ele) => ele.includes("Resource", 0));
};

const getPodcasts = (data) => {
  return data.filter((ele) => ele.includes("Podcast", 0));
};

const getEvents = (data) => {
  return data.filter((ele) => ele.includes("CodeEvent", 0));
};

const getAttendedEvents = (row) => {
  const events = [];

  for (let [key, value] of Object.entries(row)) {
    if (key.includes("CodeEvent", 0)) {
      if (value === "1") {
        events.push(key);
      }
    }
  }

  return events;
};

const getJobInterest = (row) => {
  const jobs = [];

  for (let [key, value] of Object.entries(row)) {
    if (key.includes("JobInterest", 0)) {
      if (value === "1") {
        jobs.push(key);
      }
    }
  }

  return jobs;
};

const getListensToPodcasts = (row) => {
  const podcasts = [];

  for (let [key, value] of Object.entries(row)) {
    if (key.includes("Podcast", 0)) {
      if (value === "1") {
        podcasts.push(key);
      }
    }
  }

  return podcasts;
};

const getUsesResource = (row) => {
  const resources = [];

  for (let [key, value] of Object.entries(row)) {
    if (key.includes("Resource", 0)) {
      if (value === "1") {
        resources.push(key);
      }
    }
  }

  return resources;
};

const getYoutubeChannels = (row) => {
  const channels = [];

  for (let [key, value] of Object.entries(row)) {
    if (key.includes("YouTube", 0)) {
      if (value === "1") {
        channels.push(key);
      }
    }
  }

  return channels;
};

const getInstances = (data) => {
  return data.map((ele) => {
    return {
      "@type": "Coder",
      Id: ele["ID.x"],
      Age: ele.Age,
      BootcampInfo: {
        "@type": "BootcampInfo",
        BootcampName: ele.BootcampName,
        AttendedBootcamp: ele.AttendedBootcamp,
        BootcampFinish: ele.BootcampFinish,
        BootcampLoanYesNo: ele.BootcampLoanYesNo,
        BootcampRecommend: ele.BootcampRecommend,
      },
      EventsAttended: getAttendedEvents(ele),
      CommuteTime: ele.CommuteTime,
      CityPopulation: ele.CityPopulation,
      CountryCitizen: { "@type": "Country", Name: ele.CountryCitizen },
      CountryLive: { "@type": "Country", Name: ele.CountryLive },
      EmploymentField: ele.EmploymentField,
      EmploymentStatus: ele.EmploymentStatus,
      ExpectedEarning: ele.ExpectedEarning,
      FinanciallySupporting: ele.FinanciallySupporting,
      FirstDevJob: ele.FirstDevJob,
      PersonalInfo: {
        "@type": "PersonalInfo",
        Gender: ele.Gender,
        HasChildren: ele.HasChildren,
        HasDebt: ele.HasDebt,
        HasFinancialDependents: ele.HasFinancialDependents,
        HasHomeMortgage: ele.HasHomeMortgage,
        HasServedInMilitary: ele.HasServedInMilitary,
        HasStudentDebt: ele.HasStudentDebt,
        HomeMortgageOwe: ele.HomeMortgageOwe,
        Income: ele.Income,
        IsEthnicMinority: ele.IsEthnicMinority,
        MaritalStatus: ele.MaritalStatus,
      },
      JobInfo: {
        "@type": "JobInfo",
        IsSoftwareDev: ele.IsSoftwareDev,
        IsUnderEmployed: ele.IsUnderEmployed,
        JobApplyWhen: ele.JobApplyWhen,
        JobInterest: getJobInterest(ele),
        JobPref: ele.JobPref,
        JobRelocateYesNo: ele.JobRelocateYesNo,
        JobRoleInterest: ele.JobRoleInterest,
      },
      HoursLearning: ele.HoursLearning,
      LanguageAtHome: ele.LanguageAtHome,
      MoneyForLearning: ele.MoneyForLearning,
      MonthsProgramming: ele.MonthsProgramming,
      ListensToPodcast: getListensToPodcasts(ele),
      UsesResource: getUsesResource(ele),
      SchoolDegree: ele.SchoolDegree,
      SchoolMajor: ele.SchoolMajor,
      StudentDebtOwe: ele.StudentDebtOwe,
      Channels: getYoutubeChannels(ele),
    };
  });
};

const getDistinctCountries = (data) => {
  let countriesCitizen = data.map((row) => row.CountryCitizen);
  let countriesLive = data.map((row) => row.CountryLive);
  let countries = Array.from(new Set([...countriesCitizen, ...countriesLive]));
  return countries;
};

module.exports = {
  getJobs,
  getChannels,
  getResources,
  getPodcasts,
  getEvents,
  getInstances,
  getDistinctCountries,
};
