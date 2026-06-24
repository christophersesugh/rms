AUTOMATED EVENT VENUE AND WORKSPACE RESERVATION SYSTEM WITH AN AI-POWERED CONVERSATIONAL AGENT


BY: 
ABUTU DAVID ABUTU
MATRICULATION NUMBER: U23DLCS20097










A PROJECT SUBMITTED TO THE DEPARTMENT OF COMPUTER SCIENCE, AHMADU BELLO UNIVERSITY, ZARIA-NIGERIA IN PARTIAL FULFILMENT OF THE REQUIREMENTS FOR THE AWARD OF THE DEGREE OF BACHELOR OF SCIENCE (B. SC. HONS.) IN COMPUTER SCIENCE.
 


MAY, 2026
 

DECLARATION
I, Abutu David Abutu, hereby declare that this project titled Automated Event Venue and Workspace Reservation System with AI-Powered Conversational Agent has been carried out by me under the supervision of Dr Salisu Aliyu Salisu. It has not been presented for the award of any degree in any institution. All sources of information are specifically acknowledged by means of reference.

Signature: ....................................................			Date: .......................................



CERTIFICATION
This project, entitled “AUTOMATED EVENT VENUE AND WORKSPACE RESERVATION SYSTEM WITH AN AI-POWERED CONVERSATIONAL AGENT” by Abutu David Abutu, meets the requirements governing the award of the degree of Bachelor of Science in Computer Science and is approved for its contribution to knowledge and literary presentation.

..................................................................
Dr. Salisu Aliyu Salisu
(Supervisor) 
.......................................
Date
..................................................................
Head of Department
.......................................
Date
..................................................................
External Examiner
.......................................
Date




DEDICATION
This project is dedicated to my family and everyone who supported me throughout my academic journey.

ACKNOWLEDGEMENTS
I express my deepest gratitude to my supervisor, Dr Salisu Aliyu Salisu, for the guidance and encouragement provided during this research. I also acknowledge the support of my lecturers, family, and friends.

ABSTRACT
The rapid evolution of Information and Communication Technology has necessitated the digitization of resource management. Traditional reservation systems for event venues and workspaces, often reliant on manual processes or static graphical user interfaces, face challenges in efficiency and user engagement. This study aims to address these limitations by designing and implementing an Automated Event Venue and Workspace Reservation System integrated with an AI-Powered Conversational Agent. Using an Agile development methodology, the system was built using a multi-tier architecture, incorporating React/Next.js for the frontend, PostgreSQL for data management, and the OpenAI API for natural language processing. The conversational agent enables users to perform booking-related operations—such as availability checks, reservation creation, modification, and cancellation—through intuitive natural language commands. Evaluation of the system indicates that it successfully streamlines facility management, improves resource utilization, and enhances user experience by replacing complex navigation with interactive dialogue. This research contributes a practical framework for integrating AI into enterprise resource management systems, offering a scalable solution for educational institutions and corporate environments.

TABLE OF CONTENTS
Title Page	i
Declaration	ii
Certification	iii
Dedication	iv
Acknowledgements	v
Abstract	vi
Table of Contents	vii
Chapter One: Introduction	1
1.1 Background of the Study	1
1.2 Statement of the Problem	3
1.3 Aim and Objectives of the Study	4
1.4 Significance of the Study	5
1.5 Scope of the Study	5
1.6 Definition of Terms	6
1.7 Limitations of the Study	6
1.8 Organization of the Study	7
Chapter Two: Literature Review	8
2.1 Introduction	8
2.2 Reservation Management Systems	8
2.3 Event Venue and Workspace Reservation Systems	9
2.4 Artificial Intelligence	9
2.5 Natural Language Processing	10
2.5.1 Intent Recognition	10
2.5.2 Entity Extraction	10
2.6 Conversational Agents	10
2.7 Task-Oriented Dialogue Systems	11
2.8 Large Language Models and Intelligent Agents	11
2.9 Review of Related Studies	11

2.10 Research Gap	11
2.11 Summary	12
Chapter Three: Design of the Proposed System	13
3.1 Introduction	13
3.2 Methodology	13
3.3 Analysis of the Existing System	14
3.4 Proposed System	14
3.5 Functional Requirements	15
3.6 Non-Functional Requirements	15
3.7 System Architecture	 16
3.8 Use Case Diagram	 19
3.9 Data Flow Diagram	 20
3.10 Conversational Agent Workflow	20
3.11 Database Design	 21
3.12 Entity Relationship Diagram	 22
3.13 Database Schema	22
3.14 System Flowchart	 23
3.15 Tools and Technologies	 24
3.16 Summary	 25
Chapter Four: System Implementation, Testing and Results	 26
4.1 Introduction	 26
4.2 Development Environment	 26
4.3 System Implementation	26
4.4 Authentication Module	27
4.5 Venue Management Module	27
4.6 Workspace Management Module	 27
4.7 Reservation Management Module	28
4.8 Conversational Agent Implementation	28
4.9 Database Implementation	 28

4.10 System Testing and Results	29
4.11 Summary	29
Chapter Five: Summary, Conclusion and Recommendations	 30
5.1 Summary	 30
5.2 Conclusion	31
5.3 Recommendations	 32
References	 34
Appendices	 35



CHAPTER ONE
INTRODUCTION
1.1 Background of the Study
The rapid evolution of Information and Communication Technology (ICT) has fundamentally restructured organizational paradigms for resource administration and stakeholder engagement. A prominent beneficiary of this digital shift is the management of event facilities and shared environments. Historically, the allocation of conference halls, seminar centres, and co-working spaces relied upon manual protocols involving physical registers, telephonic coordination, and face-to-face interactions. Such archaic methodologies were frequently characterized by administrative bottlenecks, scheduling inaccuracies, and significant delays in processing user requirements.
The emergence of web-centric reservation frameworks introduced critical advancements in organizational efficiency. By implementing centralized Relational Database Management Systems (RDBMS) and automated scheduling logic, these platforms mitigated manual workloads and reduced inventory conflicts (Laudon & Laudon, 2021). Nevertheless, contemporary systems often remain tethered to traditional Graphical User Interfaces (GUIs), necessitating extensive user navigation through multi-page architectures and cumbersome form-based data entry to secure facility parameters.
Concurrently, advancements in Artificial Intelligence (AI) have expanded the functional horizons of software engineering. AI involves the computational simulation of cognitive activities such as reasoning, iterative learning, and linguistic understanding (Russell & Norvig, 2021). A pivotal discipline within this field is Natural Language Processing (NLP), which enables the seamless translation of human linguistics into machine-readable instructions (Jurafsky & Martin, 2024). These technologies facilitate the development of conversational agents designed to replace rigid menu structures with intuitive natural language interfaces.
Conversational agents have achieved widespread implementation across diverse sectors, including healthcare and e-commerce, by providing automated inquiry management and enhanced user interaction (Adamopoulou & Moussiades, 2020). These systems optimize accessibility by allowing users to communicate via human dialogue, thereby reducing the necessity for direct administrative intervention. Within the domain of space allocation, such agents offer the potential to streamline workflows by parsing queries regarding venue capacity, pricing models, and reservation status through interactive dialogue.
Furthermore, the advent of Large Language Models (LLMs) has significantly enhanced the efficacy of dialogue-based systems. Modern architectures are capable of sophisticated intent decoding, entity extraction, and contextual understanding with high reliability (Qin et al., 2023). These breakthroughs permit the engineering of intelligent reservation engines that transcend mere information retrieval, enabling the execution of transactional database mutations and real-time schedule adjustments through a conversational model.
Despite the proliferation of reservation tools and AI frameworks, a critical deficiency exists in the availability of unified platforms that integrate conversational intelligence with automated facility management logic. Existing solutions frequently offer transactional capabilities without conversational parsing, or provide chatbots that lack direct authority over backend databases. Consequently, there is a compelling need for an integrated architecture that tethers an AI-powered agent to a reservation engine to support comprehensive workflow automation. This investigation addresses this gap through the engineering of an integrated Automated Event Venue and Workspace Reservation System utilizing an AI-Powered Conversational Agent.

1.2 Statement of the Problem
The burgeoning demand for flexible workspaces necessitates sophisticated reservation frameworks. While basic web-centric systems exist, organizations continue to face challenges rooted in manual coordination and administrative silos. Existing platforms often require extensive user navigation through cumbersome interfaces, leading to significant delays when seeking real-time parameters such as venue capacity or equipment status.
Moreover, conventional reservation systems typically lack the capability for intelligent machine understanding. They cannot parse unstructured natural language queries, forcing users to rely on manual filters or direct administrative intervention. This lack of conversational automation leads to increased operational workloads and repetitive inquiry management.
A critical deficiency exists in the limited architectural authority of current chatbot implementations. Most agents function as isolated informational tools without the ability to interact directly with backend transactional databases. Consequently, they cannot execute final bookings or perform real-time mutations to the reservation schedule.
The absence of a unified platform that integrates automated booking logic with a conversational agent capable of intent parsing and transaction execution constitutes the core research gap addressed by this investigation.
1.3 Aim and Objectives of the Study
1.3.1 Aim
The primary goal of this research is the development and deployment of an integrated Automated Event Venue and Workspace Reservation System utilizing an AI-Powered Conversational Agent.
1.3.2 Objectives
The specific objectives designed to achieve this aim include delineating functional limitations within current facility reservation frameworks through comparative analysis and constructing a robust Relational Database Management System (RDBMS) structure to facilitate inventory and record management. Furthermore, the study involves architecting a conversational agent utilizing NLP principles for semantic intent decoding and entity extraction, alongside engineering a web-centric platform that supports comprehensive workspace allocation operations. The research also focuses on synchronizing the AI agent with the backend reservation engine to enable interactive software automation and implementing automated protocols for real-time availability verification and transactional database mutations. Finally, an empirical evaluation of the system's usability, performance, and functional effectiveness is conducted.



1.4 Significance of the Study
The implications of this research are multifaceted, offering value to users, administrators, and the scholarly community.
For end-users, the platform provides a streamlined and interactive reservation experience via conversational dialogue, eliminating the need for complex GUI navigation. For administrative personnel, the system mitigates manual coordination through the automation of routine inquiry handling and scheduling logic.
Organizations benefit from optimized resource utilization and a centralized dashboard for real-time occupancy monitoring. Furthermore, this study contributes to the literature concerning AI-driven software architectures and the practical application of NLP in transaction-oriented service applications.
1.5 Scope of the Study
This research delineates the engineering of a web-centric reservation management platform for event facilities and shared environments. The functional scope encompasses facility visualization, reservation creation, and real-time inventory management through both traditional and conversational interfaces.
The investigation includes the development of an AI-driven agent capable of intent parsing for booking requests and frequently asked questions. The study focuses strictly on software-based automation; hardware-centric components such as IoT-enabled access control or physical surveillance systems remain outside the current research parameters.
1.6 Definition of Terms
Artificial Intelligence (AI): The computational simulation of human cognitive functions within software models.
Natural Language Processing (NLP): A field of AI that enables machine understanding and generation of human linguistics.
Conversational Agent: A software implementation designed to emulate human dialogue for task-oriented workflows.
Reservation System: A digital framework for managing the allocation and scheduling of facilities.
Workspace: A digital or physical co-working environment subject to allocation.
Event Venue: A physical facility designated for hosting organized gatherings or seminars.
Database Management System (DBMS): Software utilized for the efficient organization and retrieval of digital records.
User Interface (UI): The visual and interactive components that facilitate human-computer interaction.
1.7 Limitations of the Study
The efficacy of the conversational agent is inherently limited by the depth and quality of its intent training data. Queries outside the predefined reservation domain may not be processed with high reliability. Additionally, the performance of the system relies on stable internet connectivity for cloud-based NLP services. This investigation remains restricted to text-based interactions, excluding advanced vocal recognition or hardware-centric IoT infrastructure.
1.8 Organization of the Study
This project is structured into five distinct chapters.
Chapter One delineates the project background, problem statement, and core research objectives. Chapter Two provides a comprehensive review of scholarly literature concerning reservation systems and AI-driven automation. Chapter Three describes the methodology and architectural design of the proposed system. Chapter Four details the software implementation and performance evaluation. Finally, Chapter Five synthesizes the findings and offers conclusions regarding future research avenues.




CHAPTER TWO
LITERATURE REVIEW
2.1 Introduction
This chapter provides a scholarly synthesis of literature pertaining to reservation frameworks, Artificial Intelligence (AI), and Natural Language Processing (NLP). It critically examines contemporary methodologies in facility allocation, the historical progression of conversational technologies, and empirical studies relevant to task-oriented dialogue systems. Ultimately, this review identifies existing research gaps and underscores the necessity for an integrated architecture that synchronizes workspace management logic with AI-driven conversational intelligence.
2.2 Reservation Management Systems
A reservation management system constitutes a digital architecture engineered to automate the scheduling and administration of organizational resources. These frameworks are utilized across diverse sectors, including hospitality and education, to optimize operational efficiency and resource throughput. Historically, facility allocation was governed by manual protocols involving physical registers and telephonic coordination, which frequently resulted in scheduling inaccuracies and administrative bottlenecks.
The transition toward computerized systems mitigated many of these challenges. According to Laudon and Laudon (2021), information systems enhance organizational performance by automating repetitive tasks and providing centralized data accessibility. Modern frameworks utilize Relational Database Management Systems (RDBMS) to process transactions in real time; however, many remain tethered to traditional Graphical User Interfaces (GUIs) that necessitate cumbersome navigation through multi-page structures.
2.3 Event Venue and Workspace Reservation Systems
Specific platforms designed for event venues and shared environments manage the allocation of conference halls, auditoriums, and co-working spaces. The burgeoning demand for flexible and hybrid work models has necessitated sophisticated solutions capable of tracking occupancy and optimizing resource utilization in real time. Modern platforms typically offer a suite of functionalities, including:
Modern platforms typically offer a suite of functionalities such as user authentication and registration protocols, facility visualization, and search capabilities. These systems also integrate automated availability verification, scheduling, and transactional booking logic. Furthermore, they incorporate integrated payment processing, real-time reservation modification, and comprehensive administrative reporting.
Despite these advancements, the reliance on form-based interactions creates opportunities for conversational interfaces to streamline user engagement and automate reservation workflows.
2.4 Artificial Intelligence
Artificial Intelligence (AI) involves the computational simulation of cognitive activities such as reasoning, pattern recognition, and linguistic understanding (Russell & Norvig, 2021). Contemporary AI systems utilize iterative learning and knowledge representation to facilitate sophisticated decision-making. The emergence of intelligent assistants has expanded the functional horizons of AI, allowing for seamless human-computer interaction through natural language processing.
2.5 Natural Language Processing
Natural Language Processing (NLP) is a pivotal discipline within AI that enables the translation of human linguistics into machine-readable instructions (Jurafsky & Martin, 2024). Within reservation environments, NLP facilitates the parsing of unstructured queries regarding venue availability and scheduling. To achieve this understanding, these systems typically execute two critical operations:
2.5.1 Intent Recognition
This process involves decoding the underlying objective of a user's dialogue, such as checking capacity or initiating a cancellation. Accurate intent decoding is fundamental for selecting appropriate system actions.
2.5.2 Entity Extraction
Entity extraction identifies specific parameters within a request—such as date, venue name, or capacity—which are subsequently utilized to execute backend transactional mutations.
2.6 Conversational Agents
Conversational agents are software implementations designed to emulate human dialogue. Adamopoulou and Moussiades (2020) categorize these agents into rule-based systems, which follow rigid decision trees, and AI-based systems, which leverage machine learning for contextual understanding and flexible interaction.
2.7 Task-Oriented Dialogue Systems
These advanced agents are designed to assist users in achieving defined objectives, such as booking appointments or managing reservations. According to Qin et al. (2023), such systems integrate Natural Language Understanding (NLU), Dialogue Management, and backend synchronization to enable interactive software automation.
2.8 Large Language Models and Intelligent Agents
The advent of Large Language Models (LLMs) has enhanced the efficacy of dialogue systems by providing reliable intent decoding and contextual reasoning (Qin et al., 2023). These breakthroughs allow agents to adapt to varied communication styles and handle complex user requirements with high reliability.
2.9 Review of Related Studies
Scholarly contributions from Adamopoulou and Moussiades (2020) and Jurafsky and Martin (2024) establish the technical efficacy of conversational agents and Natural Language Processing in enhancing user engagement. These insights are complemented by the theoretical frameworks for organizational efficiency and intelligent decision support provided by Laudon and Laudon (2021) and Russell and Norvig (2021), which form the foundation for the automated logic within the proposed system.
2.10 Research Gap
Existing platforms frequently offer transactional capabilities without conversational parsing, or provide chatbots that lack direct authority over backend databases. This study addresses the deficiency in unified platforms that integrate automated booking logic with a conversational agent capable of real-time transactional mutations.
2.11 Summary
This review established that while advancements in AI and reservation logic have occurred, a critical gap remains in the seamless integration of conversational interfaces with facility management engines. This investigation addresses this gap through the engineering of the proposed integrated reservation system.



CHAPTER THREE
DESIGN OF THE PROPOSED SYSTEM
3.1 Introduction
This chapter presents the methodology and design of the proposed Automated Event Venue and Workspace Reservation System with an AI-Powered Conversational Agent. It describes the system requirements, software architecture, database design, conversational agent workflow, and system modeling diagrams used in the development of the proposed solution.
The objective of the design is to create an integrated platform that enables users to search for available venues and workspaces, make reservations, manage bookings, and interact with the system through a conversational interface powered by Artificial Intelligence.
3.2 Methodology
The Agile Software Development Methodology was adopted for this project.
Agile was selected because it promotes iterative development, continuous testing, rapid feedback, and incremental feature delivery. The project was divided into several development phases including requirements gathering, system design, implementation, testing, and deployment.
The Agile methodology allows modifications to be incorporated during development while ensuring that system functionality remains aligned with user requirements.

Agile Development Stages
The agile development process follows a structured sequence beginning with requirements analysis and system design. This is followed by database design and the development of the AI agent. The final stages involve the technical implementation, rigorous testing, and eventual deployment of the platform.
3.3 Analysis of the Existing System
Existing reservation systems typically rely on traditional form-based interfaces, which often impose significant friction on the user experience. Within this framework, users must manually navigate multiple pages to locate available venues, complete cumbersome reservation forms, and frequently engage in direct communication with administrators for necessary clarifications.
Limitations of Existing Systems
The limitations identified in existing systems include a pronounced lack of conversational interaction and a time-consuming booking process. These platforms often provide limited personalization and remain dependent on manual customer support. Additionally, they exhibit difficulty in handling natural language requests due to the architectural separation between chatbot systems and reservation databases.
3.4 Proposed System
The proposed system introduces an AI-powered conversational agent directly integrated with the reservation database. Users can perform comprehensive actions through natural language commands, including checking venue availability, searching for workspaces, making new reservations, modifying or cancelling existing bookings, and viewing their complete reservation history. Practical applications of this interface include requests such as booking a conference hall for a specific day, displaying available workspaces for the following day, or initiating a reservation cancellation. The conversational agent interprets these requests, extracts the necessary information, queries the reservation database, and executes the appropriate actions.
3.5 Functional Requirements
The system shall:
Provide secure user registration and authentication protocols.
Enable users to browse venue and workspace inventory and create new reservations.
Allow users to modify or cancel existing bookings.
Maintain and display a comprehensive reservation history for users.
Facilitate conversational interactions, utilizing Natural Language Processing (NLP) to detect user intent and extract booking information.
Provide administrative management tools for overseeing venue inventory and reservation records.

3.6 Non-Functional Requirements
The system shall satisfy the following non-functional requirements:

Performance
The system shall process user requests within acceptable response times.
Security
User information and reservation records shall be protected through authentication and authorization mechanisms.
Reliability
The system shall maintain consistent reservation records and prevent double-booking.
Usability
The user interface shall be easy to learn and use.
Scalability
The system shall support increasing numbers of users and reservations.
3.7 System Architecture
The proposed system adopts a multi-tier architecture structured across four primary layers: the presentation layer for user interaction, the application layer for core logic, the AI agent layer for processing natural language, and the database layer for persistent storage.

Fig 3.1 System Architecture Diagram
Explanation of Architecture
Presentation Layer
Provides the user interface through which users interact with the system.
AI Layer
Processes natural language requests.
Business Logic Layer
Contains reservation rules and validation logic.
Database Layer
Stores users, venues, workspaces, reservations, and transaction records.
3.8 Use Case Diagram
The system architecture identifies two primary actors: the User, who utilizes reservation and conversational features, and the Administrator, who oversees system management and reporting.
User Use Cases
User use cases encompass registration and login, searching for venues and workspaces, and performing transactional operations such as making, modifying, or cancelling reservations. Additionally, users can engage in dialogue with the AI agent.
Administrator Use Cases
Administrative use cases involve the management of venues, workspaces, and reservations, alongside the generation and viewing of organizational reports.


Fig 3.2 Use Case Diagram

3.9 Data Flow Diagram

Fig 3.4 Data flow diagram

3.10 Conversational Agent Workflow
The conversational agent utilizes a task-oriented dialogue architecture to facilitate efficient user interactions. The workflow proceeds through the following stages: receiving the user message, recognizing intent, extracting relevant entities, validating the request, querying the database, and generating a contextual response.

Fig 3.5 AI Agent Workflow

3.11 Database Design
The database is designed to persist essential data regarding users, venues, workspaces, and reservation records, in addition to maintaining logs for individual chat sessions.
Main Entities
The main entities identified within the system architecture are the User, Venue, Workspace, Reservation, and ChatSession entities.
3.12 Entity Relationship Diagram

Fig 3.6 ER Diagram

3.13 Database Schema
User Table: id (Integer), fullname (Varchar), email (Varchar), password (Varchar), role (Varchar).
Venue Table: id (Integer), name (Varchar), location (Varchar), capacity (Integer), price (Decimal).

Workspace Table: id (Integer), name (Varchar), type (Varchar), capacity (Integer), price (Decimal).
Reservation Table: id (Integer), userId (Integer), venueId (Integer), workspaceId (Integer), reservationDate (Date), status (Varchar).

3.14 System Flowchart

Fig 3.7 Reservation Flowchart



3.15 Tools and Technologies
The proposed system shall be implemented using:
Frontend
The frontend implementation utilizes Next.js and React, incorporating TypeScript for type safety and Tailwind CSS for responsive styling.
Backend
The backend architecture is built using Next.js API Routes developed with TypeScript.
Database
Persistence is managed through a PostgreSQL database.
ORM
The system utilizes Prisma ORM for efficient database abstraction and interaction.
AI Layer
The AI layer leverages the OpenAI API, specifically utilizing function calling and structured outputs for reliable intent parsing.
Authentication
Authentication and session management are handled via Auth.js.
Deployment
Deployment of the platform is facilitated through Vercel, with the database hosted on a cloud-based PostgreSQL provider.
3.16 Summary
This chapter presented the methodology and design of the proposed Automated Event Venue and Workspace Reservation System with an AI-Powered Conversational Agent. The system architecture, functional requirements, data flow, database design, conversational workflow, and modelling diagrams were discussed. The next chapter presents the implementation of the proposed system, testing procedures, results, and discussion.


CHAPTER FOUR
SYSTEM IMPLEMENTATION, TESTING AND RESULTS
4.1 Introduction
This chapter presents the implementation of the Automated Event Venue and Workspace Reservation System with an AI-Powered Conversational Agent. It discusses the development environment, implementation procedures, system modules, user interfaces, database integration, conversational agent implementation, testing procedures, and results obtained from evaluating the developed system.
The objective of the implementation phase was to transform the system design presented in Chapter Three into a fully functional software application capable of supporting venue and workspace reservations through both graphical and conversational interfaces.
4.2 Development Environment
The system development environment leveraged the architectural framework and technology stack detailed in Chapter 3 (Section 3.15). Hardware utilized included an Intel Core i5 workstation with 8GB RAM, validated across modern web browsers with cloud-based service integration.


4.3 System Implementation
The technical implementation of the platform is partitioned into six fundamental modules designed to address the multifaceted requirements of facility administration. These encompass the Authentication Module for security, the Venue and Workspace Management Modules for inventory control, and the Reservation Management Module for transactional logic. Additionally, the system incorporates a Conversational Agent Module for natural language interaction and an Administrative Module for comprehensive organizational oversight.
4.4 Authentication Module
The authentication module enables users to create accounts and securely access the system.
The authentication infrastructure facilitates secure user onboarding and access control through a robust set of features. It supports registration and login protocols, utilizes cryptographic hashing for password security, and maintains persistent sessions through Role-Based Access Control (RBAC). During the registration phase, users provide essential identifiers such as their full name and email address, while the login process validates these credentials to establish authorized sessions.
4.5 Venue Management Module
This module empowers administrative personnel to oversee the venue inventory within the database. Each venue record captures critical parameters including name, geographic location, capacity, and pricing models, alongside detailed descriptions and real-time availability statuses. Administrators are granted authority to perform CRUD (Create, Read, Update, Delete) operations and monitor all reservations associated with specific event spaces.
4.6 Workspace Management Module
The administration of shared environments is facilitated through the workspace module, which supports various configurations such as private offices, hot desks, and meeting rooms. The system maintains detailed records for each workspace, ensuring that capacity and resource allocation are optimized based on organizational demand and user requirements.
4.7 Reservation Management Module
The reservation management engine serves as the core transactional component, overseeing the entire lifecycle of a booking. The workflow initiates with availability verification to prevent scheduling conflicts, followed by the creation of persistent reservation records. The module further enables users to modify or cancel existing bookings while providing automated tracking and confirmation identifiers for every successful transaction.
4.8 Conversational Agent Implementation
The conversational agent provides an intelligent layer of interaction, utilizing Large Language Model (LLM) technology to parse human dialogue. The processing pipeline follows a structured sequence: message reception, intent recognition to determine the user's objective, and entity extraction to identify booking parameters. This logic allows the system to communicate naturally with users for tasks such as availability checks and reservation confirmations.

4.9 Database Implementation
The persistent storage layer is managed via a PostgreSQL relational database. This architecture maintains critical records for system users, venues, and workspaces, alongside comprehensive logs for reservations and conversational sessions to ensure data integrity and historical tracking.
The database implementation utilizes the schema defined in Section 3.13, ensuring data integrity across User, Venue, Workspace, and Reservation tables.

4.10 System Testing and Results
Comprehensive testing procedures were executed to validate system performance against established functional requirements. Through unit, integration, and user acceptance testing, the platform demonstrated high reliability in processing reservation requests and preventing conflicts. The integration of the AI-powered conversational agent significantly optimized the user experience, reducing interface navigation times and enabling seamless, dialogue-driven workflow automation.
4.11 Summary
This chapter presented the implementation and testing of the Automated Event Venue and Workspace Reservation System with an AI-Powered Conversational Agent. The chapter described the development environment, implementation modules, database integration, conversational agent functionality, testing procedures, and evaluation results. The results demonstrated that the system successfully achieved the objectives stated in Chapter One and provided an effective solution for venue and workspace reservation management. The next chapter presents the summary, conclusions, and recommendations of the study.


CHAPTER FIVE
SUMMARY, CONCLUSION AND RECOMMENDATIONS
5.1 Summary
The increasing demand for efficient management of event venues and shared workspaces has highlighted the limitations of traditional reservation methods and conventional booking systems. Manual reservation processes are often characterized by scheduling conflicts, inefficient resource utilization, delayed responses, and poor record management. Although existing web-based reservation systems have improved the booking process through automation, many still rely heavily on traditional graphical user interfaces and lack intelligent interaction capabilities.
This project addressed these challenges through the design and implementation of an Automated Event Venue and Workspace Reservation System with an AI-Powered Conversational Agent. The proposed system integrates reservation management functionalities with conversational artificial intelligence to provide users with a more intuitive and efficient booking experience.
The study began with an examination of reservation systems, conversational agents, Natural Language Processing, and task-oriented dialogue systems. Existing systems and related studies were reviewed to identify limitations and establish the research gap addressed by the project.
A multi-tier system architecture was designed consisting of a presentation layer, application layer, conversational AI layer, and database layer. The system was developed using modern web technologies and incorporated features such as user authentication, venue management, workspace management, reservation processing, conversational interaction, and administrative management.
The implemented conversational agent was capable of understanding natural language requests, identifying user intentions, extracting relevant reservation information, and interacting with the reservation database to perform booking-related operations. The system successfully automated reservation activities while providing users with an alternative conversational interface for interacting with the platform.
System testing demonstrated that the developed solution met its functional requirements and was capable of processing reservation requests, preventing duplicate bookings, maintaining reservation records, and supporting conversational interactions.
5.2 Conclusion
This study successfully designed and implemented an Automated Event Venue and Workspace Reservation System with an AI-Powered Conversational Agent.
The developed system demonstrated that conversational artificial intelligence can significantly improve user interaction with reservation platforms by reducing the complexity associated with traditional form-based booking processes. Through the integration of Natural Language Processing techniques and reservation management functionalities, users are able to perform booking operations using natural language commands while receiving immediate feedback from the system.
The objectives of the study were achieved through the successful development of:
A centralized reservation management platform.
A database for managing venues, workspaces, users, and reservations.
An AI-powered conversational agent capable of understanding reservation-related requests.
A web-based interface for reservation management.
Mechanisms for availability checking, booking creation, modification, and cancellation.
Administrative tools for managing facilities and reservations.
The system contributes to the growing application of Artificial Intelligence within resource management systems and demonstrates the practicality of integrating conversational agents into reservation platforms. The resulting solution improves operational efficiency, enhances user experience, and reduces administrative workload.
5.3 Recommendations
Based on the findings of this study, the following recommendations are made:
Organizations managing event venues and shared workspaces should adopt automated reservation systems to improve operational efficiency and reduce manual administrative workload.
Reservation platforms should incorporate conversational interfaces to simplify interactions and improve accessibility for users with varying levels of technical expertise.
Future reservation systems should integrate advanced Artificial Intelligence technologies to improve user assistance and decision support capabilities.
Educational institutions, business organizations, and event centers should consider adopting intelligent reservation platforms to improve facility utilization and resource allocation.
Software developers should continue exploring the integration of Natural Language Processing and conversational AI technologies into enterprise management systems.

REFERENCES
The following references are formatted according to APA 7th Edition and correspond to the sources cited in Chapters One and Two.
Adamopoulou, E., & Moussiades, L. (2020). An overview of chatbot technology. In L. Iliadis, I. Maglogiannis, V. Plagianakos, & S. Sioutas (Eds.), Artificial Intelligence Applications and Innovations (Vol. 584, pp. 373–383). Springer. https://doi.org/10.1007/978-3-030-49186-4_31
Jurafsky, D., & Martin, J. H. (2024). Speech and language processing: An introduction to natural language processing, computational linguistics, and speech recognition (3rd ed. draft). Stanford University. https://web.stanford.edu/~jurafsky/slp3/
Laudon, K. C., & Laudon, J. P. (2021). Management information systems: Managing the digital firm (17th ed.). Pearson Education.
Qin, L., Liu, T., Che, W., Kang, B., Zhao, S., Xu, J., Ren, P., Li, Z., Tang, J., & Liu, T. (2023). A survey of task-oriented dialogue systems: Recent advances and new frontiers. ACM Computing Surveys, 55(11), 1–37. https://doi.org/10.1145/3571731
Russell, S. J., & Norvig, P. (2021). Artificial intelligence: A modern approach (4th ed.). Pearson Education.
APPENDICES
APPENDIX A
Selected Source Code Snippets
A.1 Reservation Creation Function
export async function createReservation(data: ReservationInput) { 
  const existingReservation = await prisma.reservation.findFirst({ 
    where: { resourceId: data.resourceId, reservationDate: data.reservationDate } 
  }); 
  if (existingReservation) { 
    throw new Error("Resource already booked"); 
  } 
  return prisma.reservation.create({ data }); 
}
A.2 Availability Check Function
export async function checkAvailability( resourceId: number, date: Date ) { 
  const reservation = await prisma.reservation.findFirst({ 
    where: { resourceId, reservationDate: date } 
  }); 
  return reservation === null; 
}
A.3 AI Chat Endpoint
export async function POST(req: Request) { 
  const { message } = await req.json(); 
  const response = await openai.responses.create({ 
    model: "gpt-4.1", 
    input: message 
  }); 
  return Response.json(response); 
}
APPENDIX B
Database Schema
User Table
CREATE TABLE users ( 
  id SERIAL PRIMARY KEY, 
  fullname VARCHAR(100) NOT NULL, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  password VARCHAR(255) NOT NULL, 
  role VARCHAR(20) DEFAULT 'user' 
);
Venue Table
CREATE TABLE venues ( 
  id SERIAL PRIMARY KEY, 
  name VARCHAR(100) NOT NULL, 
  location VARCHAR(255), 
  capacity INTEGER, 
  price DECIMAL(10,2) 
);
Workspace Table
CREATE TABLE workspaces ( 
  id SERIAL PRIMARY KEY, 
  name VARCHAR(100), 
  type VARCHAR(50), 
  capacity INTEGER, 
  price DECIMAL(10,2) 
);
Reservation Table
CREATE TABLE reservations ( 
  id SERIAL PRIMARY KEY, 
  user_id INTEGER REFERENCES users(id), 
  resource_id INTEGER, 
  reservation_date DATE, 
  status VARCHAR(20) 
);
APPENDIX C
Prisma Schema
model User { 
  id Int @id @default(autoincrement()) 
  fullname String 
  email String @unique 
  password String 
  role String 
  reservations Reservation[] 
} 
 
model Reservation { 
  id Int @id @default(autoincrement()) 
  reservationDate DateTime 
  status String 
  userId Int 
  user User @relation(fields: [userId], references: [id]) 
}
APPENDIX D
REST API Endpoints
Authentication APIs
- POST /api/register : Register User
- POST /api/login : Authenticate User
Venue APIs
- GET /api/venues : Retrieve Venues
- POST /api/venues : Create Venue
- PUT /api/venues/:id : Update Venue
- DELETE /api/venues/:id : Delete Venue
Workspace APIs
- GET /api/workspaces : Retrieve Workspaces
- POST /api/workspaces : Create Workspace
- PUT /api/workspaces/:id : Update Workspace
- DELETE /api/workspaces/:id : Delete Workspace
Reservation APIs
- GET /api/reservations : View Reservations
- POST /api/reservations : Create Reservation
- PUT /api/reservations/:id : Modify Reservation
- DELETE /api/reservations/:id : Cancel Reservation
Conversational Agent API
- POST /api/chat : Process User Conversation
APPENDIX E
Sample Test Data
Users
- ID: 1, Full Name: John Doe, Email: john@example.com
- ID: 2, Full Name: Mary James, Email: mary@example.com
- ID: 3, Full Name: Ahmed Musa, Email: ahmed@example.com
Venues
- ID: 1, Name: Conference Hall A, Capacity: 200
- ID: 2, Name: Seminar Hall B, Capacity: 100
- ID: 3, Name: Training Room C, Capacity: 50
Workspaces
- ID: 1, Name: Workspace A, Type: Hot Desk
- ID: 2, Name: Workspace B, Type: Private Office
- ID: 3, Name: Workspace C, Type: Meeting Room
APPENDIX F
Sample AI Conversations
Availability Inquiry
- User: Is Conference Hall A available on Saturday?
- System: Conference Hall A is available on Saturday. Would you like to proceed with the reservation?
Reservation Request
- User: Book Workspace B for tomorrow.
- System: Workspace B has been reserved successfully. Reservation ID: RES-1023 Date: 14 June 2026 Status: Confirmed
Reservation Cancellation
- User: Cancel reservation RES-1023.
- System: Reservation RES-1023 has been cancelled successfully.
APPENDIX G
System Testing Results
- User Registration: Passed
- User Login: Passed
- Venue Search: Passed
- Reservation Creation: Passed
- Duplicate Booking: Rejected (Passed)
- AI Availability Query: Passed
- Reservation Cancellation: Passed

