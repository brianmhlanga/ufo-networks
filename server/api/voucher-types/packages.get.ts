const MARKETING_PACKAGES = [
  {
    id: 'charge-n-browse',
    period: '3 Hours',
    packageName: "Charge'n' Browse",
    price: 1,
    hours: 3,
    numberOfUsers: 1,
    dataGb: 4,
    packageType: 'hour',
  },
  {
    id: 'day',
    period: '24 Hours',
    packageName: 'Day',
    price: 1,
    hours: 24,
    numberOfUsers: 1,
    dataGb: 8,
    packageType: 'day',
  },
  {
    id: 'week',
    period: '7 Days',
    packageName: 'Week',
    price: 4,
    hours: 168,
    numberOfUsers: 2,
    dataGb: 20,
    packageType: 'week',
  },
  {
    id: 'month',
    period: '30 Days',
    packageName: 'Month',
    price: 10,
    hours: 720,
    numberOfUsers: 3,
    dataGb: 30,
    packageType: 'month',
  },
] as const

export default defineEventHandler(() => {
  const packages = MARKETING_PACKAGES.map((pkg) => ({
    id: pkg.id,
    period: pkg.period,
    packageName: pkg.packageName,
    name: pkg.period,
    price: pkg.price,
    hours: pkg.hours,
    numberOfUsers: pkg.numberOfUsers,
    dataGb: pkg.dataGb,
    packageType: pkg.packageType,
    description: pkg.packageName,
    isAvailable: true,
    features: [
      `Up to ${pkg.numberOfUsers} device${pkg.numberOfUsers > 1 ? 's' : ''}`,
      `Up to ${pkg.dataGb}GB`,
    ],
  }))

  return {
    success: true,
    data: packages,
    total: packages.length,
  }
})
