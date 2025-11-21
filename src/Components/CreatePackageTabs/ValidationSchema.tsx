// import * as Yup from 'yup';

// const locationInfoSchema = Yup.object({
//     locationId: Yup.string().required('Location ID is required'),
//     locationDescription: Yup.string().required('Location Description is required'),
//     contactPerson: Yup.string().required('Contact Person is required'),
//     phoneNumber: Yup.string().required('Phone Number is required'),
//     email: Yup.string().email('Invalid email').required('Email is required'),
//     addressLine1: Yup.string().required('Address Line 1 is required'),
//     addressLine2: Yup.string().required('Address Line 2 is required'),
//     city: Yup.string().required('City is required'),
//     state: Yup.string().required('State is required'),
//     country: Yup.string().required('Country is required'),
//     pincode: Yup.string().required('Pincode is required'),
//     saveAsNewLocationId: Yup.boolean().required(),
//     saveAsDefaultShipFromLocation: Yup.boolean().required(),
//     latitude: Yup.string().required('Latitude is required'),
//     longitude: Yup.string().required('Longitude is required'),
//     timeZone: Yup.string().required('Time Zone is required'),
//     locationType: Yup.string().required('Location Type is required'),
//     glnCode: Yup.string().required('GLN Code is required'),
//     iataCode: Yup.string().required('IATA Code is required'),
// });

// const packageDetailsItemSchema = Yup.object({
//     productId: Yup.string().required("Product ID is required"),
//     productName: Yup.string().required("Product Name is required"),
//     hsnCode: Yup.string().required("HSN Code is required"),
//     rfid: Yup.string().required("RFID-EPC Code is required"),
//     dimensions: Yup.string().required("Dimensions are required"),
//     quantity: Yup.number()
//         .typeError("Quantity must be a number")
//         .min(1, "Quantity must be at least 1")
//         .required("Quantity is required"),
//     weight: Yup.string().required("Weight is required"),
//     packagingType: Yup.string().required("Packaging Type is required"),
// });

// const pickupDropoffSchema = Yup.object({
//     pickupDateTime: Yup.string().required('Pick-up Date and Time is required'),
//     dropoffDateTime: Yup.string()
//         .required('Drop-off Date and Time is required')
//         .test(
//             'is-after-pickup',
//             'Drop-off Date & Time must be after Pick-up Date & Time',
//             function (value) {
//                 const { pickupDateTime } = this.parent;
//                 if (!pickupDateTime || !value) return true;
//                 return new Date(value) > new Date(pickupDateTime);
//             }
//         ),
//     notes: Yup.string().required('Notes are required'),
// });


// const additionalInfoSchema = Yup.object().shape({
//     referenceId: Yup.string(), // Optional
//     invoiceNumber: Yup.string().required('Invoice Number is required'),
//     poNumber: Yup.string().required('PO Number is required'),
//     salesOrderNumber: Yup.string().required('Sales Order Number is required'),
//     department: Yup.string().required('Department is required'),
//     deliveryType: Yup.string().required('Delivery Type is required'),
//     deliveryMode: Yup.string().required('Delivery Mode is required'),
//     stnDoNumber: Yup.string(), // Optional
//     valueOfGoods: Yup.number()
//         .typeError('Value of Goods must be a number')
//         .required('Value of Goods is required'),
//     eWayBillNumber: Yup.string().when('valueOfGoods', {
//         is: (val: number) => val >= 50000,
//         then: Yup.string().required('E-Way Bill Number is required for value of goods >= 50000'),
//         otherwise: Yup.string().notRequired(),
//     }),
//     returnLabel: Yup.boolean().required(),
//     file: Yup.mixed().required('File is required'),
// });


// export const createPackageValidationSchema = Yup.object({
//     shipFrom: locationInfoSchema.required('Ship From details are required'),
//     shipTo: locationInfoSchema
//         .concat(
//             Yup.object({
//                 destination_radius: Yup.string().required('Destination radius is required'),
//                 destination_radius_unit: Yup.string().required('Destination radius unit is required'),
//             })
//         )
//         .required('Ship To details are required'),
//     billTo: locationInfoSchema.required('Bill To details are required'),
//     packageDetails: Yup.array()
//         .of(packageDetailsItemSchema)
//         .min(1, 'At least one package detail is required')
//         .required('Package details are required'),
//     additionalInfo: additionalInfoSchema.required('Additional Information is required'),
//     pickupDropoff: pickupDropoffSchema.required('Pickup and dropoff details are required'),
// });



import * as Yup from 'yup';

const locationInfoSchema = Yup.object({
    locationId: Yup.string().required('Location ID is required'),
    locationDescription: Yup.string().required('Location Description is required'),
    contactPerson: Yup.string().required('Contact Person is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    addressLine1: Yup.string().required('Address Line 1 is required'),
    // addressLine2: Yup.string().required('Address Line 2 is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    pincode: Yup.string().required('Pincode is required'),
    saveAsNewLocationId: Yup.boolean().required(),
    saveAsDefaultShipFromLocation: Yup.boolean().required(),
    latitude: Yup.string().required('Latitude is required'),
    longitude: Yup.string().required('Longitude is required'),
    timeZone: Yup.string().required('Time Zone is required'),
    locationType: Yup.string().required('Location Type is required'),
    glnCode: Yup.string().required('GLN Code is required'),
    // iataCode: Yup.string().required('IATA Code is required'),
});

const packageDetailsItemSchema = Yup.object({
    productId: Yup.string().required("Product ID is required"),
    productName: Yup.string().required("Product Name is required"),
    hsnCode: Yup.string().required("HSN Code is required"),
    dimensions: Yup.string().required("Dimensions are required"),
    quantity: Yup.number()
        .typeError("Quantity must be a number")
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
    packagingType: Yup.string().required("Packaging Type is required"),
});

const pickupDropoffSchema = Yup.object({
    pickupDateTime: Yup.string().required('Pick-up Date and Time is required'),
    dropoffDateTime: Yup.string()
        .required('Drop-off Date and Time is required')
        .test(
            'is-after-pickup',
            'Drop-off Date & Time must be after Pick-up Date & Time',
            function (value) {
                const { pickupDateTime } = this.parent;
                if (!pickupDateTime || !value) return true;
                return new Date(value) > new Date(pickupDateTime);
            }
        ),
});

const additionalInfoSchema = Yup.object().shape({
    invoiceNumber: Yup.string().required('Invoice Number is required'),
    poNumber: Yup.string().required('PO Number is required'),
    salesOrderNumber: Yup.string().required('Sales Order Number is required'),
    department: Yup.string().required('Department is required'),
    deliveryType: Yup.string().required('Delivery Type is required'),
    deliveryMode: Yup.string().required('Delivery Mode is required'),// Optional
    valueOfGoods: Yup.number()
        .typeError('Value of Goods must be a number')
        .required('Value of Goods is required'),
    // eWayBillFile: Yup.mixed().when('valueOfGoods', (valueOfGoods, schema) => {
    //     let val: number = 0;
    //     if (Array.isArray(valueOfGoods)) {
    //         // If array, either pick first element or treat as invalid
    //         val = Number(valueOfGoods[0]) || 0;
    //     } else if (typeof valueOfGoods === 'string') {
    //         val = Number(valueOfGoods);
    //     } else if (typeof valueOfGoods === 'number') {
    //         val = valueOfGoods;
    //     } else {
    //         val = 0; // default or invalid type
    //     }

    //     if (isNaN(val) || val < 50000) {
    //         return schema.notRequired();
    //     }

    //     // Require the file if valueOfGoods >= 50000
    //     return schema.test({
    //         name: 'fileRequired',
    //         exclusive: true,
    //         message: 'E-Way Bill file is required for value of goods >= 50000',
    //         test: (value) => {
    //             if (!value) return false; // no file selected
    //             if (typeof value === 'string') return value.trim() !== '';
    //             if (value instanceof File) return value.size > 0;
    //             return true;
    //         },
    //     });
    // }),

    eWayBillFile: Yup.mixed().when('valueOfGoods', (valueOfGoods, schema) => {
        let val = 0;

        if (Array.isArray(valueOfGoods)) {
            val = Number(valueOfGoods[0]) || 0;
        } else if (typeof valueOfGoods === 'string') {
            val = Number(valueOfGoods);
        } else if (typeof valueOfGoods === 'number') {
            val = valueOfGoods;
        }

        if (isNaN(val) || val < 50000) {
            return schema.notRequired();
        }

        return schema.test({
            name: 'fileRequired',
            exclusive: true,
            message: 'E-Way Bill file is required for value of goods >= 50000',
            test: (value) => {
                if (value === null || value === undefined) return false;
                if (typeof value === 'string') return value.trim() !== '';
                if (value instanceof File) return value.size > 0;
                return true;
            },
        });
    }),


    file: Yup.mixed().required('File is required'),
});

export const createPackageValidationSchema = Yup.object({
    shipFrom: locationInfoSchema.required('Ship From details are required'),
    shipTo: locationInfoSchema
        .concat(
            Yup.object({
                destination_radius: Yup.string().required('Destination radius is required'),
                destination_radius_unit: Yup.string().required('Destination radius unit is required'),
            })
        )
        .required('Ship To details are required'),
    billTo: locationInfoSchema.required('Bill To details are required'),
    packageDetails: Yup.array()
        .of(packageDetailsItemSchema)
        .min(1, 'At least one package detail is required')
        .required('Package details are required'),
    additionalInfo: additionalInfoSchema.required('Additional Information is required'),
    pickupDropoff: pickupDropoffSchema.required('Pickup and dropoff details are required'),
});
