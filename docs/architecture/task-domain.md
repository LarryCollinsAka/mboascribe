# Task domain

MboaScribe separates the customer/commercial **Order** from operational **Work Tasks**.

- Orders own customer, service, quote, payment and source/deliverable context.
- Task types are data-driven catalog entries (not PostgreSQL enums).
- Work tasks are concrete units of production attached to an order.
- `current_assignee_id` is the fast current pointer; `task_assignments` preserves assignment history.
- One worker may hold several RBAC roles and receive several task categories.
- Writing/academic support is represented as a service plus task types such as academic review, research assistance, citation formatting, essay support and assignment support.
- Assignment/homework support is limited to tutoring, explanation, feedback, editing and revision support; the platform should not market impersonation or submission of assessed work as the customer's own.
