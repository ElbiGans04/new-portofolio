let us = {
    tools: [
      {
        _id: `6156dc227b3a2c26309b5eea`,
        name: 'React js',
        as: 'library',
        __v: 0
      }
    ],
    id: `6156dc2e7b3a2c26309b5ef3`,
    title: 'Pantau Corona',
    startDate: `2021-08-06T00:00:00.000Z`,
    endDate: `2021-09-06T00:00:00.000Z`,
    url: 'http://pantaucorona-elbi.herokuapp.com/',
    description: 'website application that displays data about covid-19',
    typeProject: { _id: 'A1', projects: [], name: 'Personal Project', __v: 0 },
    images: [
      {
        _id: `6156dc2e7b3a2c26309b5ef4`,
        src: 'elbi-project-1633082413503-131180727-images.jpg'
      }
    ],
    __v: 0
  }

for (let te in us) {
    console.log(te, us.hasOwnProperty(`url`))
}