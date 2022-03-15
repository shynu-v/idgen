import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import "./History.css";

export const History = () => {
	const token = localStorage.getItem("token");

	const [studentDetails, setStudentDetails] = useState([]);
	const [courseList, setCourseList] = useState("");
	const [batchList, setBatchList] = useState("");

	useEffect(() => {
		axios
			.get("/api/batch/applications", {
				headers: {
					"Content-Type": "application/json",
					authorization: "JWT " + token,
				},
			})
			.then(function (res) {
				setStudentDetails(res.data);
			});
	}, []);

	const getcourse = async (id) => {
		axios.get(`/api/admin/${id}/getcourse`).then((res) => {
			setCourseList(res.data.name);
		});
	};

	const getbatch = async (id) => {
		axios.get(`/api/admin/${id}/getbatch`).then((res) => {
			setBatchList(res.data.batchName);
		});
	};

	const table = (student, key) => {
		getcourse(student.course);
		getbatch(student.batch);
		if (student.isApproved !== "pending") {
			return (
				<tbody key={key}>
					<tr>
						<td>{student.name}</td>
						<td>{student.email}</td>
						<td>{courseList}</td>
						<td>
							<img src={student.photo} alt='profilepic'></img>
						</td>
						<td>{batchList}</td>
						<td>{student.startDate.substring(0, 10)}</td>
						<td>{student.endDate.substring(0, 10)}</td>
						<td>{student.isApproved}</td>
					</tr>
				</tbody>
			);
		}
	};

	return (
		<div className='statustable'>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Course</th>
						<th>Image</th>
						<th>Batch</th>
						<th>Start Date</th>
						<th>End Date</th>
						<th>Status</th>
					</tr>
				</thead>

				{studentDetails.map((student, key) => table(student, key))}
			</table>
		</div>
	);
};
