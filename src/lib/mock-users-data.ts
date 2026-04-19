import { User, UserRoleType } from "@/types/dashboard/users-type";

// Generate 1000 mock users for demonstration (100 pages with 10 per page)
export const generateMockUsers = (count: number = 1000): User[] => {
  const users: User[] = [];
  const roles: UserRoleType[] = ["admin", "member", "moderator"];
  const domains = ["example.com", "test.com", "demo.com", "mail.com", "company.com", "business.com"];
  const firstNames = [
    "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Mary",
    "William", "Jennifer", "Richard", "Linda", "Joseph", "Patricia", "Thomas", "Barbara",
    "Charles", "Susan", "Christopher", "Jessica", "Daniel", "Karen", "Matthew", "Nancy",
    "Anthony", "Betty", "Mark", "Helen", "Donald", "Sandra", "Steven", "Donna", "Paul", "Ashley",
    "Andrew", "Kimberly", "Joshua", "Donna", "Kevin", "Carol", "Brian", "Michelle", "George", "Emily",
    "Edward", "Amanda", "Ronald", "Melissa", "Timothy", "Deborah", "Jason", "Stephanie", "Jeffrey", "Rebecca",
    "Ryan", "Sharon", "Jacob", "Laura", "Gary", "Sarah", "Nicholas", "Kimberly", "Eric", "Jessica",
    "Jonathan", "Ashley", "Stephen", "Lisa", "Larry", "Nancy", "Justin", "Karen", "Scott", "Betty",
    "Brandon", "Helen", "Benjamin", "Sandra", "Samuel", "Donna", "Gregory", "Carol", "Frank", "Michelle",
    "Alexander", "Emily", "Raymond", "Amanda", "Patrick", "Melissa", "Jack", "Deborah", "Dennis", "Stephanie",
    "Jerry", "Rebecca", "Tyler", "Sharon", "Aaron", "Laura", "Jose", "Sarah", "Adam", "Kimberly",
    "Henry", "Jessica", "Peter", "Ashley", "Christian", "Lisa", "Walter", "Nancy", "Ryan", "Karen",
    "Ethan", "Betty", "Jeremy", "Helen", "Harold", "Sandra", "Keith", "Donna", "Carl", "Carol",
    "Terry", "Michelle", "Robert", "Emily", "Sean", "Amanda", "Austin", "Melissa", "Arthur", "Deborah",
    "Lawrence", "Stephanie", "Jesse", "Rebecca", "Dylan", "Sharon", "Bryan", "Laura", "Joe", "Sarah"
  ];
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson",
    "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez",
    "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen",
    "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards",
    "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy",
    "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray"
  ];
  const departments = [
    "Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "IT", "Customer Service", 
    "Legal", "Product", "Design", "Research", "Quality Assurance", "Business Development", "Admin"
  ];
  const statuses = ["active", "inactive", "pending"] as const;

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    users.push({
      id: i.toString(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      role: role,
      avatar: `https://images.unsplash.com/photo-${1472099645785 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80`,
      department: department,
      status: status,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return users;
};

// Generate initial 1000 users
export const mockUsers = generateMockUsers(1000);
