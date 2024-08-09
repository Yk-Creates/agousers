// types.ts

export interface BookCabParams {
    startLat: number | null;
    startLong: number | null;
    endLat: number | null;
    endLong: number | null;
    date: string;
    time: string;
    type: string;
    model: string;
    desc: string; 
  }
  
  export interface ApiResponse<T> {
    data: T;
  }
  
  export interface User {
    id: string;
    name: string;
    phoneNo: string;
    // Add other user properties
  }
  
  // Define other interfaces as needed
  