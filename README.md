# Fortune Telling Web Application

เว็บแอปพลิเคชันสำหรับการดูดวงออนไลน์ โดยผู้ใช้สามารถกรอกข้อมูลวันเกิดและเลือกประเภทการดูดวง เพื่อรับคำทำนายและคำแนะนำในรูปแบบที่เข้าใจง่าย โดยระบบพัฒนาในรูปแบบ **Frontend-only Web Application** ไม่มีฐานข้อมูล และสามารถนำไป Deploy บน GitHub Pages ได้

---

## 1. สมาชิกกลุ่ม

| ลำดับ | ชื่อ-นามสกุล                 |รหัสนิสิต   |
| ----- | ---------------------------- |----------- |
| 1     | นางสาวณัฏฐกานต์ สุริยะศรี    |68102010198 |
| 2     | นายธราธร การนา               |68102010204 |
| 3     | นางสาวชยาภา สุวรรณจินดา      |68102010294 |
| 4     | นางสาวสุรีย์รัตน์ หงษ์กำเนิด |68102010563 |

---

# 2. ที่มาของปัญหาและความสำคัญ

ในปัจจุบันการดูดวงเป็นกิจกรรมที่ได้รับความสนใจจากผู้คนหลากหลายกลุ่ม โดยเฉพาะการดูดวงเกี่ยวกับเรื่องความรัก การงาน การเงิน และการเรียน อย่างไรก็ตาม การเข้าถึงคำทำนายในบางรูปแบบอาจมีขั้นตอนที่ซับซ้อน หรือผู้ใช้ต้องค้นหาข้อมูลจากหลายแหล่ง

กลุ่มผู้จัดทำจึงมีแนวคิดในการพัฒนา **Fortune Telling Web Application** เพื่อเป็นเว็บแอปพลิเคชันที่ช่วยให้ผู้ใช้สามารถดูคำทำนายได้อย่างสะดวก โดยมีขั้นตอนการใช้งานที่ไม่ซับซ้อน ตั้งแต่การกรอกวันเกิด การเลือกประเภทการดูดวง ไปจนถึงการแสดงผลคำทำนายและคำแนะนำ

โครงการนี้มุ่งเน้นการพัฒนา Web Application ตามกระบวนการ Software Development Life Cycle (SDLC) และแนวคิด Scrum โดยเริ่มต้นจากการเก็บรวบรวมและวิเคราะห์ความต้องการของผู้ใช้จริงก่อนนำไปพัฒนาระบบ

---

# 3. จุดประสงค์ของ Project

1. เพื่อพัฒนาเว็บแอปพลิเคชันสำหรับการดูดวงที่ใช้งานง่าย
2. เพื่อให้ผู้ใช้สามารถกรอกข้อมูลวันเกิดและรับคำทำนายได้
3. เพื่อให้ผู้ใช้สามารถเลือกประเภทของการดูดวงตามความสนใจ
4. เพื่อแสดงคำทำนายและคำแนะนำในรูปแบบที่เข้าใจง่าย
5. เพื่อฝึกกระบวนการพัฒนาซอฟต์แวร์ตั้งแต่การเก็บ Requirement จนถึงการ Deploy
6. เพื่อประยุกต์ใช้ GitHub ในการจัดการ Source Code, Issue, Product Backlog และ Sprint Backlog
7. เพื่อฝึกการทำงานร่วมกันเป็นทีมด้วยแนวคิด Scrum และการแบ่งงานตาม Sprint

---

# 4. ประโยชน์ที่คาดว่าจะได้รับ

* ผู้ใช้สามารถเข้าถึงคำทำนายได้ง่ายและสะดวก
* ลดขั้นตอนในการค้นหาคำทำนายจากหลายแหล่ง
* ผู้ใช้สามารถเลือกหัวข้อการดูดวงที่สนใจได้
* ผู้ใช้ได้รับคำแนะนำประกอบคำทำนาย
* สมาชิกในกลุ่มได้ฝึกกระบวนการพัฒนา Web Application
* สมาชิกได้ฝึกการทำงานร่วมกันผ่าน GitHub และ Scrum
* สามารถนำระบบไปใช้งานผ่าน GitHub Pages ได้

---

# 5. ขอบเขตของ Project

## 5.1 สิ่งที่ระบบสามารถทำได้

1. แสดงหน้าแรกของระบบ
2. แสดงรายละเอียดและคำอธิบายของระบบ
3. ให้ผู้ใช้กรอกข้อมูลวันเกิด
4. ตรวจสอบความถูกต้องของข้อมูลที่ผู้ใช้กรอก
5. ให้ผู้ใช้เลือกประเภทการดูดวง
6. ประมวลผลข้อมูลตาม Fortune Algorithm ที่กำหนด
7. แสดงผลคำทำนาย
8. แสดงคำแนะนำที่เกี่ยวข้องกับคำทำนาย
9. ให้ผู้ใช้เริ่มการดูดวงใหม่
10. รองรับการใช้งานบนอุปกรณ์ที่มีขนาดหน้าจอแตกต่างกัน

## 5.2 ประเภทการดูดวง

ระบบเบื้องต้นรองรับประเภทการดูดวงดังต่อไปนี้

* ความรัก (Love)
* การงาน (Career)
* การเงิน (Finance)
* การเรียน (Education)
* ภาพรวมชีวิต (Overview)

## 5.3 สิ่งที่ระบบไม่ครอบคลุม

* ไม่มีระบบสมัครสมาชิก
* ไม่มีระบบ Login / Logout
* ไม่มีระบบชำระเงิน
* ไม่มีระบบฐานข้อมูล
* ไม่มีระบบจัดเก็บประวัติการดูดวงถาวร
* ไม่มีระบบแชตกับหมอดู
* ไม่มีระบบเชื่อมต่อกับผู้ให้บริการดูดวงภายนอก
* คำทำนายเป็นข้อมูลเพื่อความบันเทิงและแนวทางทั่วไป ไม่ใช่คำแนะนำทางวิชาชีพ

---

# 6. Functional Requirements

| ID    | รายละเอียด                                                 
| ----- | ---------------------------------------------------------- 
| FR-01 | ระบบต้องแสดงหน้าแรกและข้อมูลแนะนำเว็บไซต์
| FR-02 | ระบบต้องให้ผู้ใช้เลือกประเภทการดูดวงได้
| FR-03 | ผู้ใช้สามารถเลือกวัน/เดือน/ปีเกิดจากปฏิทิน
| FR-04 | ระบบตรวจสอบว่าข้อมูลที่กรอกถูกต้องและครบถ้วน
| FR-05 | ระบบต้องแสดง error message เมื่อข้อมูลที่กรอกไม่ครบหรือไม่ถูกต้อง
| FR-06 | ระบบนำข้อมูลผู้ใช้ไปประมวลผลคำทำนายตาม Fortune Algorithm
| FR-07 | ระบบเลือกคำทำนายตามผลการประมวลผล
| FR-08 | ระบบแสดงผลคำทำนายให้ผู้ใช้
| FR-09 | ระบบแสดงคำแนะนำที่เกี่ยวข้องกับผลการดูดวง
| FR-10 | ผู้ใช้สามารถเริ่มดูดวงใหม่ได้

---

# 7. Non-Functional Requirements

| ID    | รายละเอียด                                                 
| ----- | ---------------------------------------------------------- 
| NFR-01 | หน้าเว็บควรโหลดและตอบสนองต่อการใช้งานอย่างรวดเร็ว
| NFR-02 | เว็บไซต์ต้องรองรับ Mobile, Tablet และ Desktop                    
| NFR-03 | เว็บไซต์ต้องทำงานบน Chrome, Edge, Firefox และ Safari รุ่นปัจจุบันที่รองรับ                
| NFR-04 | ระบบต้องไม่จัดเก็บข้อมูลส่วนตัวของผู้ใช้บน Server       
| NFR-05 | ข้อมูลที่ผู้ใช้กรอกต้องถูกประมวลผลภายใน Browser และไม่ส่งไปยัง Database        
| NFR-06 | โครงสร้างระบบควรสามารถเพิ่มประเภทการดูดวงและคำทำนายได้โดยไม่ต้องเปลี่ยนโครงสร้างหลัก 
| NFR-07 | ระบบต้องไม่ล่มเมื่อผู้ใช้กรอกข้อมูลไม่ครบ                            

---

# 10. Product Backlog และ Sprint Backlog

## 10.1 Product Backlog

**คำอธิบาย:** Product Backlog คือรายการงานทั้งหมดของโครงการ ครอบคลุมทั้งงานด้านเอกสาร/การวางแผน (Documentation Tasks), งานบันทึกวิดีโอ (Tasks) และรายการความต้องการของระบบในรูปแบบ User Story ทีมใช้ **GitHub Issues** ในการติดตามสถานะ โดยรายการงานจะถูกเลือกเข้าสู่ Sprint Backlog ผ่านระบบ **Milestone** ในแต่ละรอบ Sprint Planning

**ภาพหน้าจอ Product Backlog (GitHub Issues):**

![Product Backlog Screenshot](./screenshots/all-issues_open.png)
![Product Backlog Screenshot](./screenshots/all-issues_closed.png)

**รายการ Product Backlog ทั้งหมด (จาก GitHub Issues):**

| # | Issue / Requirement | ประเภท | Label | Milestone | สถานะ |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **#1** | เขียนที่มาของปัญหาและความสำคัญ | Documentation | `documentation` | Sprint 1 | Closed |
| **#2** | จุดประสงค์ของโครงงาน และประโยชน์ที่คาดว่าจะได้รับ | Documentation | `documentation` | Sprint 1 | Closed |
| **#3** | Functional Requirement & Non-Functional Requirement | Documentation | `documentation` | Sprint 1 | Closed |
| **#4** | TOR | Documentation | `documentation` | Sprint 1 | Open |
| **#5** | ขอบเขตของ Project | Documentation | `documentation` | Sprint 1 | Closed |
| **#6** | อธิบายกระบวนการทำงาน โดยใช้ Process, Methods, and Tools | Documentation | `documentation` | Sprint 1 | Open |
| **#7** | เขียนสรุปการประชุม Retrospective | Documentation | `documentation` | Sprint 1 | Open |
| **#8** | Link to Retrospective Youtube Video | Documentation | `documentation` | Sprint 1 | Open |
| **#9** | Retrospective video -1 (ที่มา ปัญหา วัตถุประสงค์) | Task | – | Sprint 1 | Closed |
| **#10** | Retrospective video -2 (ขอบเขตของ Project) | Task | – | Sprint 1 | Closed |
| **#11** | Retrospective video -3 (Functional Requirements) | Task | – | Sprint 1 | Closed |
| **#12** | Retrospective video -4 (Non-Functional Requirements) | Task | – | Sprint 1 | Closed |
| **#13** | FR-10: รีสตาร์ตกระบวนการดูดวงใหม่ (Restart Fortune Process) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#14** | FR-9: แสดงคำแนะนำที่เกี่ยวข้องกับคำทำนาย (Recommendations) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#15** | FR-8: แสดงผลคำทำนายบนหน้าจอ (Display Prediction) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#16** | FR-7: คัดเลือกคำทำนายตามผลการคำนวณ (Match Prediction) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#17** | FR-6: ประมวลผลข้อมูลผ่าน Fortune Algorithm | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#18** | FR-5: แสดง Error Message เมื่อข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#19** | FR-4: ตรวจสอบความครบถ้วนถูกต้องของข้อมูล (Input Validation) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#20** | FR-3: กรอกวันเดือนปีเกิดผ่าน Calendar Picker | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#21** | FR-2: เลือกประเภทการดูดวง (Love, Career, Finance, etc.) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#22** | FR-1: หน้าแรกและคำอธิบายเว็บไซต์ (Homepage & Intro) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#23** | video requirements interviews (สัมภาษณ์เพื่อเก็บข้อมูล Requirements) | Documentation | `documentation` | Sprint 1 | Closed |
| **#24** | [README DOC] เขียนสรุปขั้นตอนการทำ requirement | Documentation | `documentation` | Sprint 1 | Open |
| **#25** | NFR-1: หน้าเว็บโหลดและตอบสนองอย่างรวดเร็ว (Fast Loading & Response) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#26** | NFR-2: รองรับการใช้งาน Mobile, Tablet, Desktop (Responsive Design) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#27** | NFR-3: รองรับเบราว์เซอร์ Chrome, Edge, Firefox, Safari (Cross-browser) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#28** | NFR-4: ไม่จัดเก็บข้อมูลส่วนตัวของผู้ใช้บน Server (Data Privacy) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#29** | NFR-5: ประมวลผลใน Browser ไม่ส่งข้อมูลไป Database (Client-side Only) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#30** | NFR-6: โครงสร้างระบบรองรับการเพิ่มประเภทคำทำนายได้ง่าย (Extensibility) | User Story | `user-story` | *[รอกำหนด]* | Open |
| **#31** | NFR-7: ระบบไม่ล่มเมื่อผู้ใช้กรอกข้อมูลไม่ครบ (Graceful Error Handling) | User Story | `user-story` | *[รอกำหนด]* | Open |

---

## 10.2 Sprint Backlog (Sprint 1)

**คำอธิบาย:** Sprint Backlog คือชุดของ Issue ที่ทีมเลือกมาจาก Product Backlog เพื่อดำเนินงานให้เสร็จสิ้นภายในกรอบเวลาของ Sprint 1 โดยใน GitHub จัดการผ่าน Milestone **"Sprint 1"** ซึ่งในรอบนี้เน้นการวิเคราะห์ความต้องการ (Requirement Gathering), การกำหนดขอบเขตโครงงาน, การจัดทำเอกสารรายงาน (Documentation) และการจัดทำ Retrospective เพื่อเตรียมความพร้อมก่อนเข้าสู่รอบการพัฒนาโค้ดจริง

**ภาพหน้าจอ Sprint Backlog (GitHub Milestone "Sprint 1"):**

![Sprint Backlog Screenshot](./screenshots/backlog_overview.png)
![Sprint Backlog Screenshot](./screenshots/sprint1-backlog_closed.png)

*ภาพหน้าจอ Milestone "Sprint 1" แสดง Progress Bar และรายการ Issue ทั้งหมดที่ถูกผูกไว้กับ Sprint 1*

**รายละเอียด Sprint 1:**

| หัวข้อ | รายละเอียด |
| :--- | :--- |
| **ชื่อ Sprint** | Sprint 1 |
| **ระยะเวลา** | 3 กันยายน 2026 – *ยังไม่กำหนดวันสิ้นสุด* |
| **เป้าหมายของ Sprint (Sprint Goal)** | วิเคราะห์และกำหนดขอบเขต Requirements, จัดทำโครงร่าง Product Backlog/User Story ทั้งหมด, สรุปกระบวนการทำงานลงใน README.md และบันทึก Retrospective Video สะท้อนปัญหาและแนวทางแก้ไข |
| **Issues ใน Sprint 1** | **รวม 14 Issues:**<br>• Documentation: #1, #2, #3, #4, #5, #6, #7, #8, #23, #24<br>• Tasks/Video: #9, #10, #11, #12 |
| **ผลลัพธ์ที่คาดหวัง (Deliverables)** | 1. เอกสารรายงาน (README.md) หัวข้อ 1–10 ครบถ้วนสมบูรณ์<br>2. วิดีโอ Requirements Interview และวิดีโอ Retrospective <br>3. Product Backlog บน GitHub Issues ที่มี User Story ครบทั้ง FR และ NFR (#13–#31) พร้อมสำหรับการวางแผนใน Sprint ถัดไป |